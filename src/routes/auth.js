//import jwt from 'jwt-simple';
import jwt from 'jsonwebtoken';
import request from 'request';
import { user } from './user';

let auth = {
  tokensignin: (req, res) => {

    console.log('got data', req.body);
    let accessToken = req.body.accessToken,
        loginService = req.body.loginService,
        email = req.body.email,
        name =  req.body.name;

    let tokenInfoEndpoint;

    if (loginService == 'google') {
      console.log('checking with google...');
      // NOTE: Could be a security issue if the accessToken is misused
      // for function calls.
      tokenInfoEndpoint
        = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
    } else if (loginService == 'facebook') {
      console.log('checking with facebook...');
      tokenInfoEndpoint = 'https://graph.facebook.com/app?access_token='
    }

    let tokenVerifyURL = `${tokenInfoEndpoint}${accessToken}`;
    console.log('sending request to ', tokenVerifyURL);

    // Verify if the token is valid with the endpoint
    request(tokenVerifyURL, (error, response, body) => {
      console.log('got response', body);
      console.log('statusCode', response.statusCode);
      if (!error && response.statusCode == 200) {
        let profile = {
          name: name,
          email: email
        }

        let token = jwt.sign(profile, 'nyancat', { expiresInMinutes: 60*5 });

        // collect user data from the db and check if the user already exists
        user.getDetails(email, (result) => {
          // for existing users
          res.json({ token: token, success: true, user: result });
        }, () => {
          // new users
          res.json({ token: token, success: false, code: 'new-user',
                     message: 'Create a user profile' });
        }
        );
      } else {
        res.send(401, 'Invalid token');
      }
    });

  }
}


/*
function genToken(user) {
  let expires = exporesIn(7);
  let token = jwt.encode({
      exp: expires
    }, 'nyancat');

  return {
    token: token,
    expores: expires,
    user: user
  };
}

function expiresIn(numDays) {
  let dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
*/

export { auth };
