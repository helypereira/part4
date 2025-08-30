import { test, describe } from 'node:test'
import assert from 'node:assert'
import { dummy } from '../utils/list_helper.js'


//4.3
describe('dummy', () => {
  test('dummy returns one', () => {
    const result = dummy([])
    assert.strictEqual(result, 1)
  })
})
