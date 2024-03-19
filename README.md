# Automatic Translation App

Automatic Translation App makes it easy for editors to translate into many popular languages by providing a Widget for this. Translation is made using Google's Cloud Translation API. Both plain text and HTML markup are supported. 

## Setup
### Building

```bash
git clone https://github.com/seeds/automatic-translation-xp.git
cd automatic-translation-xp
./gradlew clean build
```

### Installation

Install the application and add it to your site. A valid API Key from Google Cloud then needs to be defined in the app settings in order to use the Widget.

## Known issues

- When translating content in Automatic mode the value stored for input fields like radioButton will also be translated. This may result in invalid options once the object is modified and the page is refreshed.
- It is possible that iframes present in HtmlArea fields stop working once the object is modified and the page is refreshed.

Editors may want to double check and review the translated values before publishing the changes.

## License and credits

A license is required to use this application. Once the app is installed, the Widget will be blocked until a license is provided.

You can contact [Seeds](https://www.seeds.no/) to request a license. If a valid license is not found in the system, it can be installed by clicking the button `Upload license` in the Widget.

Made by [Seeds Consulting](https://seeds.no)







