### How to deploy the site

You will need a few more dependencies installed first :

1. Gulp

       npm install gulp-cli -g
    
2. Build the site first

       gulp build
 
3. Ensure you have your AWS credentials in your environment
 
       # whereever you have your AWS credentials stored
       source ~/MY_AWS_CREDENTIALS
       
4. Deploy the site to s3:

        # for staging - staging.racing-apps.com
        gulp deploy --env staging  
    
        # for PRODUCTION - www.racing-apps.com
        gulp deploy --env production
    
    
