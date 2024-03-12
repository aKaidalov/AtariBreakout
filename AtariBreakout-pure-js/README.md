# Pure JS pong demo

Run from command line

~~~sh
http-server -c-1
~~~

## http-server

Files are served from `./public` if the folder exists, and `./` otherwise.

docs:  
[npm http-server](https://www.npmjs.com/package/http-server)

## Favicon

[Favicon creator](https://www.favicon.cc/)

## OSX custom git function

Lazy git...

~~~sh
function lgit(){
    git add .
    git commit -a -m "$1"
    git push
}
~~~

Usage:
~~~sh
lgit "initial commit no 2"
~~~