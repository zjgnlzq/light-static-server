

---------------------------


## Install

```bash
$ npm install lss -g
```

## Usage

```bash
lss
```
can start server, use the config.json for default option

```bash
lss -h
```
can see the help info

```bash
lss --version 
```
can see the version of lss

```bash
lss --port 80 
```
can start the server at port of 80

```bash
lss -o
```
can start the server, but can't see the dir in brower


中文文档：https://github.com/zjgnlzq/light-static-server/docs

## Edit config.json
example
```javascript
{
	"path": {
		"/test/": "/usr/local/www",    // "/test/" is the url you request in browser, "/usr/local/www" is the dir path on you computer
		"/test-a/": "/usr/local/a/b/c/"
	},
  	"onlyStatic": false, // only serve for file, can't see the dir in browser
  	"port": 7000 // the port of server listen on
}
```



## Report a issue

* [All issues](https://github.com/zjgnlzq/light-static-server/issuess)
* [New issue](https://github.com/zjgnlzq/light-static-server/issues/new)

## License

lss is available under the terms of the MIT License.
