const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTORY = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000


const userSchema = new Schema({
	username: {
		unique: true,
		type: String
	},
	email: {
		unique: true,
		type: String
	},
	password: {
		unique: true,
		type: String
	},
	loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updatedAt: {
			type: Date,
			default: Date.now()
		}
	}
})

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.method = {
	comparePassword: (_password, password) => {
		return new Promise((resolve, reject) => {
			bcrypt.compare(_password, password, (err, isMatch) => {
				if(err) reject(err)
				else resolve(isMatch)
			})
		})
	},
	incLoginAttempts: (user) => {
		return new Promise((resolve, reject) => {
			if(this.isLocked && this.lockUntil < Date.now()) {
				this.update({
					$set: {
						loginAttempts: 1
					},
					$unset: {
						lockUntil: 1
					}
				}, (err) => {
					if(err) reject(err)
					else resolve(true)
				})
			}else {
				let update = {
					$inc: {
						loginAttempts: 1
					}
				}
				if(this.loginAttempts + 1 >=  MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
			}
		})
	}
}

userSchema.pre('save', function(next)  {
	if(this.isNew) {
		this.createdAt = this.updatedAt = Date.now()
	}else {
		this.updatedAt = Date.now()
	}
	next()
})

userSchema.pre('save', function (next) {
	if(!this.isModified('password')) return next()
	bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
		if(err) return next(err)
		bcrypt.hash(this.password, salt, (error, hash) => {
			if(error) return next(error)
			this.password = hash
			next()
		})
	})
})

mongoose.model('User', userSchema)