import { describe, expect, it } from 'vitest'
import {
  count,
  dedupeLines,
  findReplace,
  lorem,
  removeExtraSpaces,
  removeBlankLines,
  reverseChars,
  reverseLines,
  reverseWords,
  shuffleLines,
  slugify,
  sortLines,
  toCamel,
  toConstant,
  toKebab,
  toLower,
  toPascal,
  toSentence,
  toSnake,
  toTitle,
  toUpper,
  toggleCase,
  trimLines,
  words,
} from './text'

describe('case', () => {
  it('upper/lower', () => {
    expect(toUpper('aB')).toBe('AB')
    expect(toLower('aB')).toBe('ab')
  })
  it('title', () => {
    expect(toTitle('hello world')).toBe('Hello World')
    expect(toTitle('the QUICK brown')).toBe('The Quick Brown')
  })
  it('sentence', () => {
    expect(toSentence('hello world. bye now')).toBe('Hello world. Bye now')
  })
  it('camel/pascal', () => {
    expect(toCamel('hello world foo')).toBe('helloWorldFoo')
    expect(toPascal('hello world')).toBe('HelloWorld')
    expect(toCamel('already-kebab-case')).toBe('alreadyKebabCase')
  })
  it('snake/kebab/constant', () => {
    expect(toSnake('Hello World')).toBe('hello_world')
    expect(toKebab('Hello World')).toBe('hello-world')
    expect(toConstant('Hello World')).toBe('HELLO_WORLD')
  })
  it('toggle', () => {
    expect(toggleCase('Hello')).toBe('hELLO')
  })
  it('words splits camelCase', () => {
    expect(words('helloWorldFoo')).toEqual(['hello', 'World', 'Foo'])
    expect(words('XMLHttpRequest')).toEqual(['XML', 'Http', 'Request'])
  })
})

describe('count', () => {
  it('empty', () => {
    const c = count('')
    expect(c.chars).toBe(0)
    expect(c.words).toBe(0)
    expect(c.lines).toBe(0)
  })
  it('basic', () => {
    const c = count('Hello world.\nSecond line here.')
    expect(c.words).toBe(5)
    expect(c.lines).toBe(2)
    expect(c.sentences).toBe(2)
    expect(c.charsNoSpaces).toBe('Helloworld.Secondlinehere.'.length)
  })
  it('paragraphs', () => {
    expect(count('a\n\nb\n\nc').paragraphs).toBe(3)
  })
  it('unicode chars', () => {
    expect(count('😀').chars).toBe(1)
  })
})

describe('dedupe', () => {
  it('keep first', () => {
    expect(dedupeLines('a\nb\na\nc')).toBe('a\nb\nc')
  })
  it('case insensitive', () => {
    expect(dedupeLines('a\nA\nb', { caseInsensitive: true })).toBe('a\nb')
  })
  it('trim', () => {
    expect(dedupeLines('a\n a \nb', { trim: true })).toBe('a\nb')
  })
  it('keep last', () => {
    expect(dedupeLines('a\nb\na', { keep: 'last' })).toBe('b\na')
  })
})

describe('sort', () => {
  it('asc', () => {
    expect(sortLines('c\na\nb')).toBe('a\nb\nc')
  })
  it('desc', () => {
    expect(sortLines('a\nc\nb', { descending: true })).toBe('c\nb\na')
  })
  it('numeric', () => {
    expect(sortLines('10\n2\n1', { numeric: true })).toBe('1\n2\n10')
  })
  it('removeEmpty', () => {
    expect(sortLines('b\n\na', { removeEmpty: true })).toBe('a\nb')
  })
})

describe('reverse', () => {
  it('lines', () => {
    expect(reverseLines('a\nb\nc')).toBe('c\nb\na')
  })
  it('chars', () => {
    expect(reverseChars('abc')).toBe('cba')
  })
  it('words', () => {
    expect(reverseWords('one two three')).toBe('three two one')
  })
  it('shuffle deterministic', () => {
    const seq = [0.9, 0.1, 0.5]
    let i = 0
    const rand = () => seq[i++ % seq.length]
    expect(typeof shuffleLines('a\nb\nc', rand)).toBe('string')
  })
})

describe('whitespace', () => {
  it('extra spaces', () => {
    expect(removeExtraSpaces('a    b   c')).toBe('a b c')
    expect(removeExtraSpaces('  lead  trail  ')).toBe('lead trail')
  })
  it('trim lines', () => {
    expect(trimLines('  a  \n b ')).toBe('a\nb')
  })
  it('remove blank', () => {
    expect(removeBlankLines('a\n\n\nb')).toBe('a\nb')
  })
})

describe('slugify', () => {
  it('basic', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })
  it('diacritics', () => {
    expect(slugify('Crème Brûlée')).toBe('creme-brulee')
  })
  it('custom sep', () => {
    expect(slugify('Hello World', { separator: '_' })).toBe('hello_world')
  })
  it('preserve case', () => {
    expect(slugify('Hello World', { lower: false })).toBe('Hello-World')
  })
})

describe('findReplace', () => {
  it('literal', () => {
    const r = findReplace('a b a', 'a', 'X')
    expect(r.text).toBe('X b X')
    expect(r.count).toBe(2)
  })
  it('escapes special chars', () => {
    expect(findReplace('a.b.c', '.', '-').text).toBe('a-b-c')
  })
  it('case insensitive', () => {
    expect(findReplace('A a', 'a', 'X', { caseInsensitive: true }).count).toBe(2)
  })
  it('regex with backref', () => {
    expect(findReplace('2026-08', '(\\d+)-(\\d+)', '$2/$1', { regex: true }).text).toBe('08/2026')
  })
  it('empty find is noop', () => {
    expect(findReplace('abc', '', 'X').text).toBe('abc')
  })
})

describe('lorem', () => {
  it('words count', () => {
    const seq = Array(50).fill(0.5)
    let i = 0
    const out = lorem({ unit: 'words', count: 5, startClassic: false, rand: () => seq[i++] })
    expect(out.split(' ').length).toBe(5)
  })
  it('paragraphs separated by blank line', () => {
    const out = lorem({ unit: 'paragraphs', count: 2, rand: () => 0.5 })
    expect(out.split('\n\n').length).toBe(2)
  })
  it('classic opener', () => {
    const out = lorem({ unit: 'sentences', count: 2, rand: () => 0.5 })
    expect(out.startsWith('Lorem ipsum dolor sit amet')).toBe(true)
  })
})
