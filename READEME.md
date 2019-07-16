# Queries

## Simple query

```graphql
{
  users {
    firstName
    lastName
    ...posts
  }
  posts {
    author
    content
    ...likes
  }
}

fragment posts on User {
  posts {
    ...post
  }
}

fragment post on Post {
  id
  content
  ...likes
}

fragment likes on Post {
  likes {
    userId
    howMuch
  }
}
```

## Mutation

```graphql
mutation Foo {
  createPost(author: 1, content: "The new content") {
    id
    content
  }
}
```
