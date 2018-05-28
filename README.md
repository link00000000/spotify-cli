# Spotify CLI

A command line interface for Spotify.

![Spotify CLI demonstration](https://i.imgur.com/7iDXj5w.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* [NodeJS](https://nodejs.org/en/) v10.0.0 or higher. Have not tested with older versions.
* NPM v6.0.0 or higher. Have not tested with older versions.
* Spotify Premium Account

### Installing

Clone the repository to a local folder.

```
git clone https://github.com/link00000000/spotify-cli.git spotify-cli
```

To setup an application with Spotify for Developers, visit [Spotify for Developers](https://beta.developer.spotify.com/dashboard/applications) and create an app.

Create a file called .env in the root directory with the following information.

```
CLIENT_ID=<spotify app client id>
CLIENT_SECRET=<spotify app client secret>
REDIRECT_URI=http://localhost:37915
```

Install NPM dependencies. Do NOT use npm install since it will not install dependencies for subdirectories, use the run script instead.

```
npm run install-dependencies
```

Start the main script using the run script.

```
npm start
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Logan Crandall** - *Initial work* - [link00000000](https://github.com/link00000000)

See also the list of [contributors](https://github.com/link00000000/spotify-cli/contributors) who participated in this project.

## License

This project is licensed under the GPL3 License - see the [LICENSE.md](https://github.com/link00000000/spotify-cli/blob/master/LICENSE) file for details.
