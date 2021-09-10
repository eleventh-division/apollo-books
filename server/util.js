import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import config from './config/index.js';

export const encryptPassword = password => new Promise((resolve, reject) => {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			reject(err)
			return false
		}
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) {
				reject(err)
				return false
			}
			resolve(hash)
			return true
		})
	})
})

export const comparePassword = (password, hash) => new Promise(async (resolve, reject) => {
	try {
		const isMatch = await bcrypt.compare(password, hash)
		resolve(isMatch)
		return true
	} catch (err) {
		reject(err)
		return false
	}
})

export const getToken = payload => {
    const token = jwt.sign(payload, config.secret, {
        expiresIn: 604800, // 1 Week
    })
    return token
}

export const getPayload = token => {
    try {
        const payload = jwt.verify(token, config.secret);
        return { loggedIn: true, payload };
    } catch (err) {
        // Add Err Message
		// console.error(err)
        return { loggedIn: false }
    }
}
