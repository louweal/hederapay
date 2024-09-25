# Instructions

Additional instructions for developers.

## Plugin zipping

Create a new plugin zip, containing all files except the `node_modules`

```
zip -r hederapay.zip hederapay -x "hederapay/node_modules/*"
```
