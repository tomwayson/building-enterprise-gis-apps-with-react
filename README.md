# Building Enterprise GIS Apps with React

This repository contains the source code and resources from the **Building Enterprise GIS Apps with React** course, which is offered as part of the [2020 Esri Developer Summit pre-summit hands-on training](https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training).

## Presenters

- Dave Bouwman [@dbouwman](https://github.com/dbouwman)
- Mike Juniper [@mjuniper](https://github.com/mjuniper)
- Tom Wayson [@tomwayson](https://github.com/tomwayson)
- Markham Shofner [@MarkhamShofner](https://github.com/MarkhamShofner)
- Andrew Tate [@drewctate](https://github.com/drewctate)

## Outline

- Building an App
  - slides (TODO: modify http://mjuniper.github.io/presentations/ds2019/ambitious-apps-building.html for Ember -> React, and probably replace routing concepts w/ testing, need for UI framework)
  - [workshop](./workshop/1-building-an-app.md)
- Components
  - slides (TODO: take bootstrap slides from https://tomwayson.github.io/devsummit-2019/ambitious-arcgis-apps-3-addons.html and component related info from http://mjuniper.github.io/presentations/ds2019/ambitious-apps-architecture.html#/13 and Ember -> React)
  - [workshop](./workshop/2-components.md)
- Routing
  - slides (TODO: get routing concepts from http://mjuniper.github.io/presentations/ds2019/ambitious-apps-building.html for Ember -> React, and talk about React equivalents to services from http://mjuniper.github.io/presentations/ds2019/ambitious-apps-architecture.html)
  - [workshop](./workshop/3-routing.md)
- Data
  - slides (TODO: cobble together something from the above presos about arcgis-rest-js, also cover fetching data in components with the `useEffect()` hook)
  - [workshop](./workshop/4-data.md)
- Authentication
  - slides (TODO: @dbouwman)
  - [workshop](./workshop/5-auth.md)
- Maps
  - slides (TODO: modify https://tomwayson.github.io/devsummit-2019/ambitious-arcgis-apps-5-maps.html#/ for Ember -> React)
  - [workshop](./workshop/6-maps.md)
- Deployment
  - slides (TODO)
  - workshop (TODO)

## Source Code

If you go through the above workshops, you should have an application that looks like the code in this repository.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node >= 8.10](https://nodejs.org/) (with NPM v5.2+)

## Further Reading / Useful Links

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
