# Batch uploader for People Finder

Started at #RHoK Basel, Switzerland - June 4th/5th, 2011 by [loleg](https://github.com/loleg) and [philippkueng](https://github.com/philippkueng)

Batch-People-Finder is a Web application that is used to import data from a remotely hosted list of missing people, and populate an instance of [Google Person Finder](https://person-finder.appspot.com) with the information. Users are presented with a simple form to paste in the address of remotely hosted data, a confirmation screen shows the imported data and checks for duplicate entries before it is uploaded to the Person Finder instance.

We currently support PFIF 1.3 XML, as well as JSON or CSV with PFIF field names.

* Problem: [http://www.rhok.org/problems/upload-tool-person-finder](http://www.rhok.org/problems/upload-tool-person-finder)
* Solution: [http://www.rhok.org/node/2689](http://www.rhok.org/node/2689)
* Code: [https://github.com/loleg/batch-people-finder](https://github.com/loleg/batch-people-finder)
* Chat: Freenode IRC #peoplefinder

## INSTALLATION (on Ubuntu 10.04 LTS)

Install the newest stable release of [node.js](http://nodejs.org) (to date 0.4.8)

	$ sudo apt-get install git-core -y
	$ git clone git://github.com/joyent/node.git
	$ cd node/
	$ git checkout v0.4.8
	$ ./configure
	$ sudo make
	$ sudo make install

Install npm (the node.js packet manager)

	$ git clone http://github.com/isaacs/npm.git
	$ cd npm
	$ sudo make install

Dependencies which should be installed via npm

	$ npm install express
	$ npm install jade
	$ npm install nodeunit

Clone the batch-people-finder source code

	$ git clone git://github.com/loleg/batch-people-finder.git

Get additional dependencies by updating the git submodules

	$ cd batch-people-finder/
	$ git submodule update --init

## TESTING

	$ nodeunit tests/

## RUNNING

	$ node app.js

## CONFIGURATION

Edit app.js to change default port (3000) and keys.

## LICENSE

Batch-People-Finder is licensed under the [CC BY-SA 3.0 - CreativeCommons Attribution-ShareAlike 3.0 License](http://creativecommons.org/licenses/by-sa/3.0/)
