# Image Secure - A Javascript project 

In the client side web developement class (at the Aix-en-Provence IUT) we had to create a website using jQuery and its mobile
version with jQuery Mobile.

You can find the websites here : 
- [The desktop version] (http://image-secure.munoz.ovh)
- [The mobile version] (http://mobile.image-secure.munoz.ovh)

## How to set up this website on my own web server ?
It's quiet simple (if you're on Windows I recommand you to use cmder to follow these steps. [Download cmder](http://gooseberrycreative.com/cmder/)

- Clone this project 
```
git clone https://github.com/thomasmunoz13/image-secure
```
- Then install or download composer (more info [here](https://getcomposer.org/doc/00-intro.md)).
- Install the [SFramework](https://github.com/thomasmunoz13/SFramework) dependencies (it's just twig don't be afraid) 
```
cd image-secure
[php composer.phar] install // this part may change depending of your installation
```
- Create your image-secure database (with the config/database.sql given)
- And the last commands : 
```
cd image-secure 
mkdir content
chmod 777 content/
cd mobile/
ln -s ../content .
```

- Enjoy !

***Note*** : *if you're using nginx you have to use this config*
```nginx
autoindex off;
location / {
  rewrite ^(.*)$ /index.php/$1 break;
}
```
