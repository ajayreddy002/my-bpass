import fetch from 'isomorphic-unfetch';

export default async (req, res) => {
  await fetch('http://localhost:3001/test', {
    method: 'POST',
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // },
    body: req.body
  }).then(response => response.json());

  res.status(200).send('Successfully called API');
};

export const config = {
  api: {
    bodyParser: {
      urlencoded: {
        extended: true
      }
    }
  }
};
