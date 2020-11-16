# Octommit

## Env

`GITHUB_TOKEN` is the only **required** env var. This is the `personal access token` for a github user/bot

## Commands

### help

Lists avalible `octommit` commands

#### Usage

`octommit help`

### Update

Used to update a yaml file in github

#### Usage

```
octommit update --set[path.to.var]=new_value --set[foo.bar[]]=yawn --remove[some.arrayValue[]]=yawn --remove [some.property] --o --pr --repo <reponame> --org Stockopedia --sourcePath path/to/file.yaml --outputPath /path/to/outputfile.yaml --sourceBranch main --outputBranch some-other-branch --message "commit message"
```

#### Options

| name         | type     | desc                                                                                                                                                           | env                                                                                                                                     | cli                                                                    |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| repo         | string   | The name of the github repository.                                                                                                                             | `REPO=<name>`                                                                                                                           | `--repo <name>`                                                        |
| pr           | boolean  | Whether or not to open a PR. Will only do so if the target branch it different to the output branch.                                                           | `CREATE_PR=true`                                                                                                                        | `--pr`                                                                 |
| output       | boolean  | Whether or not to output the command response                                                                                                                  |                                                                                                                                         | `--o`                                                                  |
| set          | string[] | Key/value pairs to replace in the output file. Can either add a unique item to an array (will create if does not exist), add a property, or update a property. |                                                                                                                                         | `--set [path.to.var]=replacement` `--set [path.to.array[]]=new_value`  |
| remove       | string[] | key/value pairs of items to remove. Can be an array item, or a property                                                                                        |                                                                                                                                         | `--remove [path.to.prop]` `--remove [path.to.array[]]=value_to_remove` |
| org          | string   | Name of github organisation                                                                                                                                    | `ORG=Stockopedia`                                                                                                                       | `--org Stockopedia`                                                    |
| sourcePath   | string   | Path to yaml file                                                                                                                                              | `SOURCE_FILE=path/to/file.yaml`                                                                                                         | `--sourcePath path/to/file.yaml`                                       |
| outputPath   | string   | The output path for the resulting yaml. Can be the same file, or a new file                                                                                    | `OUTPUT_PATH=path/to/output.yaml`                                                                                                       | `--outputPath path/to/output.yaml`                                     |
| sourceBranch | string   | The name of the branch in which to find the file                                                                                                               | `SOURCE_BRANCH=branch-name`                                                                                                             | `--sourceBranch branch-name`                                           |
| outputBranch | string   | The branch name for the resulting yaml                                                                                                                         | Can be the same as the source branch. If the outputBranch already exists, it will use that/ If it does not, it will create a new branch | `OUTPUT_BRANCH=branch-name`                                            | `--outputBranch branch-name` |
| message      | string   | The desired github commit message                                                                                                                              | `MESSAGE=chore(some-scope): some useful message`                                                                                        | `--message "chore(some-scope): some useful message"`                   |

## Contributing

example .env

```
GITHUB_ACCESS_TOKEN=
SOURCE_FILE=deployments/app/directory-service/values.yaml
VALUE_PATH=image.tag
VALUE=8893009
REPO=cluster-test
OUTPUT_PATH=deployments/app/directory-service/values-2.yaml
ORG=Stockopedia
SOURCE_BRANCH=master
OUTPUT_BRANCH=chore/argo-bot-test-3
MESSAGE=chore(directory-service): update docker tag
CREATE_PR=true
```
