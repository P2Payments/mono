import { defineEventHandler } from 'h3'
import { getCurrencies } from '../../utils/getCurrencies.js'

export default defineEventHandler(() => Object.keys(getCurrencies()).sort())
