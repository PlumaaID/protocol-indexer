# Protocol Indexer

A backend to track digital endorsements on the blockchain. It indexes endorsements from [PlumaaID's protocol](https://github.com/PlumaaID/protocol).

## Sample queries

### Get all endorsements currently owned by an account

```graphql
{
  account(id: "0x2B8E4729672613D69e5006a97dD56A455389FB2b") {
    id
    tokens {
      id
    }
  }
}
```

### Get the current owner and all transfer events for an endorsement

```graphql
{
  token(id: "7777") {
    owner {
      id
    }
    transferEvents {
      from
      to
      timestamp
    }
  }
}
```
