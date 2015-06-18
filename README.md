# Mushpup Demo

A simple demonstration of the [Mushpup Javascript password library](https://github.com/klenwell/mushpup)
running on the [Flask framework](https://github.com/GoogleCloudPlatform/appengine-python-flask-skeleton)
for Google App Engine.

The site itself can be found here:

- [https://mushpup-demo.appspot.com/](https://mushpup-demo.appspot.com/)


## Install

1. Create project at https://console.developers.google.com/project
2. Clone repository
   ```
   cd ~/projects/mushpup-demo
   git clone git@github.com:klenwell/mushpup-demo.git app-engine
   ```
3. Install Python and Pip dependencies (using [pyenv](https://github.com/yyuu/pyenv))
   ```
   cd ~/projects/mushpup-demo/app-engine
   pyenv local 2.7.7
   ~/.pyenv/versions/2.7.7/bin/pip install -r requirements.txt -t lib
   ```
## Local Server

To run the local development server:

    cd ~/projects/mushpup-demo/app-engine
    dev_appserver.py --port=3000 --admin_port=3001 --api_port=3002 .

Application will run on [http://localhost:3000](http://localhost:3000).


## Deploy

To deploy the application:

1. Use the [Admin Console](https://appengine.google.com) to create a
   project/app id. (App id and project id are identical)
1. [Deploy the
   application](https://developers.google.com/appengine/docs/python/tools/uploadinganapp) with

   ```
   appcfg.py -A <your-project-id> --oauth2 update .
   ```
1. Congratulations!  Your application is now live at your-app-id.appspot.com


## Feedback

Use the github issue tracker to give feedback on this repo.
