## Quote

This project is directly based from [quotable](https://github.com/lukePeavey/quotable).
All data has been copied from this [repository](https://github.com/quotable-io/data).

## Overview

This project was made because the original repo has no working api left.
I needed some of the features, so I recreated some of it.
I just added more limits because hosting on aws can get expensive.

### API Servers

```
https://api-quotes.carladi.com
```

### Required Headers

```
X-API-Key: prodK7WWeH7MxXXb4f7j76chxR3ukwsj2g6TV6HQ
```

## API Reference

- [Get random Quote](#get-random-quote)
- [Get Quote of the Day](#get-quote-of-the-day)
- [Get Quote By ID](#get-quote-by-id)
- [List Tags](#list-tags)

## Get random Quote

```HTTPS
GET /random
```

Get one or more random quotes from the database.

**Query parameters**

| param     | type     | Description                                                            |
| :-------- | :------- | :--------------------------------------------------------------------- |
| limit     | `int`    | The number of random quotes to retrieve.                               |
| minLength | `int`    | The minimum Length in characters. ( can be combined with `maxLength` ) |
| maxLength | `int`    | The maximum Length in characters. ( can be combined with `minLength` ) |
| tags      | `string` | Get a random quote with specific tag(s).                               |
| author    | `string` | Get a random quote by one author.                                      |

**Response**

```ts
[
    {
      id: string
      // The quotation text
      content: string
      // The full name of the author
      author: string
      // The length of quote (number of characters)
      length: number
      // An array of tag names for this quote
      tags: string[]
    }
]
```

<br>

## Get Quote of the Day

```HTTPS
GET /daily-quote
```

**Response**

```ts
{
  id: string
  // The quotation text
  content: string
  // The full name of the author
  author: string
  // The length of quote (number of characters)
  length: number
  // An array of tag names for this quote
  tags: string[]
}
```

<br>

## Get Quote by ID

```HTTPS
GET /quote/:id
```

**Response**

```ts
[
    {
      id: string
      // The quotation text
      content: string
      // The full name of the author
      author: string
      // The length of quote (number of characters)
      length: number
      // An array of tag names for this quote
      tags: string[]
    }
]
```

<br>

## List Tags

```HTTP
GET /tags
```

Get a list of all tags

**Query parameters**

| param  | type   | Description            |
| :----- | :----- | :--------------------- |
| sortBy | `enum` | `"name", "quoteCount"` |
| order  | `enum` | `"asc", "desc"`        |

**Response**

```ts
{
  // The number of all tags by this request
  count: number;
  // The array of tags
  results: Array<{
    _id: string;
    name: string;
  }>;
}
```
