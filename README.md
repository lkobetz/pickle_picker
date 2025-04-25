# Welcome to Picture Picker 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Get API Key

   This app uses the pixabay API. For local development, you'll need to obtain an API key from [pixabay](https://pixabay.com/api/docs/).
   Create a file in the project root directory called `secrets.ts` and add the following to it:
   ```
   export default apiKey = "your_api_key";
   ```

3. Start the app

   ```bash
    npx expo start
   ```

4. Search for images

   1. Search for any image you want.
   2. Select an image to view more information about it.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
