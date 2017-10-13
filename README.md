## Installation instructions
- yarn install
- createdb <user>
- psql -f setup_db.sql
- yarn start
- visit localhost:4000/playground

## Demo Query
```
{
  post(id: 1) {
    id
    title
  }
  posts {
    id
    title
    comments(limit: 2) {
      id
      text
      user {
        email
      }
    }
  }
}
```