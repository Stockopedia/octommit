# Octommit-connector

```js
new Octommit(<github_access_token>)
    .update()
    .org('Stockopedia')
    .repository(string)
    .sourceBranch(string)
    .outputBranch(string)
    .sourcePath(string)
    .outputPath(string)
    .outputPath(string)
    .set(path: string, value: string)
    .set(path: string, value: string)
    .remove(path: string)
    .commit(message: string)
    .pr()
    .run()
```
