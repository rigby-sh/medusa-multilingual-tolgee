![Medusa Multilingual Tolgee Plugin](https://rigby-web.fra1.digitaloceanspaces.com/medusa-multilingual-tolgee.png)

<div align="center">
  <h1>Medusa Multilingual Tolgee Plugin | Rigby</h1>
  <p>Translate your product information with ease.</p>
  
  <!-- Shields.io Badges -->
  <a href="https://github.com/rigby-sh/medusa-multilingual-tolgee/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://rigbyjs.com/en#contact">
    <img alt="Support" src="https://img.shields.io/badge/support-contact%20author-blueviolet.svg" />
  </a>

  <!-- Documentation and Website Links -->
  <p>
    <a href="https://www.medusajs.com/">Medusa</a> |
        <a href="https://tolgee.io/">Tolgee</a> |
    <a href="https://rigbyjs.com/en">Rigby</a>
  </p>
</div>
<br>

## About the plugin

This plugin integrates Medusa eCommerce with Tolgee, an open-source localization platform, to provide an easy translation management solution. It's designed to simplify product data translation without the need for complex CMS or PIM systems. By leveraging Tolgee, users access powerful localization features directly within their Medusa admin panel.

**Key Features of Tolgee**

- **In-Context Translating**: Utilize Tolgee’s development tools to translate content directly on the frontend, providing a real-time, intuitive translating experience.
- **Translation Assistance**: Enhance translation accuracy and speed with automatic translation suggestions powered by leading AI services such as DeepL, Google Translate, and AWS Translate.
- **Collaborative Workflows**: Streamline the translation process with features that support collaboration, allowing teams to easily review and approve translations, ensuring consistency and quality.

Tolgee is all about making the translation process as simple as possible. For more details on the extensive capabilities of Tolgee, visit their official website: [Tolgee.io](https://tolgee.io/)

## Plugin features

| Feature                                        | Status     |
|------------------------------------------------|------------|
| Admin widget to manage product translations    | ✅         |
| Add product translations                       | ✅         |
| Sync all product with Tolgee                   | ✅         |
| Automatically add translations when product is added | ✅   |
| Automatically remove translations when product is removed | ✅ |
| Support for collections                        | Coming soon       |
| Support for categories                         | Coming soon        |
| Support for nested product data eg. variant data | Coming soon      |
| Support for custom attributes                  | Coming soon        |


## How to use

#### Set up your Tolgee project

Before configuring the Medusa plugin, ensure your Tolgee project is ready. You can either set up an open-source version of Tolgee on your own infrastructure or opt for the managed cloud version offered by Tolgee. Obtain your project ID from the project's dashboard URL (e.g., `https://app.tolgee.io/projects/YOUR_PROJECT_ID`).

#### Install the plugin

```javascript
npm install medusa-multilingual-tolgee
```

or 

```javascript
yarn add medusa-mulitilingual-tolgee
```

#### Add plugin configurations to medusa-config.js

Once your Tolgee project is set up, add the plugin configuration to your Medusa store by modifying the `medusa-config.js` file. Here's what you need to include:

```javascript
const plugins = [
  {
    resolve: `medusa-multilingual-tolgee`,
    options: {
      defaultLanguage: "en",
      availableLanguages: [
        { label: "English", tag: "en" },
        { label: "German", tag: "de" },
        { label: "Polish", tag: "pl" },
      ],
      productsKeys: ["title", "subtitle", "description"],
      projectId: "your_tolgee_project_id",
      enableUI: true,
    },
  },
];
```

Configuration options: 

- **defaultLanguage**: This is the default language for your translations. By default, set to "en" for English, but it can be adjusted based on your primary audience.
- **availableLanguages**: This array contains objects defining the languages you want to support. Each object should have a **`label`**, which is the display name of the language, and a **`tag`**, which is the language code (as defined in your Tolgee project). Make sure these tags match the language tags in your Tolgee project.
- **productsKeys**: Specify which properties of the Medusa product data should be translatable. Common keys include **`"title"`**, **`"subtitle"`**, and **`"description"`**, but you can specify any other fields you need translated.
- **projectId**: Your Tolgee project ID, which you can find in the URL of your project dashboard on the Tolgee platform.
- **enableUI**: Set this to **`true`** to enable the translation management UI components within the Medusa admin. This will allow users to manage translations directly from the Medusa admin panel.

#### Set Environment Variables in Medusa

```javascript
MEDUSA_ADMIN_TOLGEE_API_URL=your_tolgee_app_url
MEDUSA_ADMIN_TOLGEE_API_KEY=your_tolgee_api_key
```

Explanation of Variables

- **`MEDUSA_ADMIN_TOLGEE_API_URL`**: This is the base URL where your Tolgee instance is hosted. If you are using the Tolgee cloud service, this will be **`https://app.tolgee.io`**. If you have a self-hosted instance, replace this URL with the URL of your own deployment.
- **`MEDUSA_ADMIN_TOLGEE_API_KEY`**: You can find or generate a new API key by navigating to /account/apiKeys within your Tolgee dashboard. If you haven't generated an API key yet, create one by following the prompts in the Tolgee interface.

#### Sync all your products with Tolgee 

After configuring your environment variables and setting up the plugin, it's time to synchronize your product data with Tolgee to enable translations across your e-commerce platform. Here's how to complete the synchronization process and start translating your products:

**Restart Medusa**: First, ensure that all your changes are saved, then restart your Medusa server to apply the new configuration settings. This ensures that all components are loaded correctly, including the newly configured translation management plugin.

**Access the Translation Management Section**: Navigate to the product edit page within your Medusa admin panel. Here's what you need to do:

**Scroll to the Translation Management Section**: On the product edit page, scroll down until you find a new section labeled "Translation Management". This section is added by the **`medusa-multilingual-tolgee`** plugin and provides the tools necessary for managing product translations.

![Medusa Multilingual Tolgee Plugin](https://rigby-web.fra1.digitaloceanspaces.com/translation-management-not-synced.png)

**Initiate the Sync Process**: Click on the "Sync all translations" button within the Translation Management section. This action triggers a batch job that communicates with Tolgee to create translations for existing products.

**Wait for Completion**: After clicking the sync button, the process may take some time depending on the number of products and the complexity of the translations.

![Medusa Multilingual Tolgee Plugin](https://rigby-web.fra1.digitaloceanspaces.com/translation-management-synced.png)

Congratulations! Your configuration is now complete, and you can start translating all of your products. 🎉

If you want to translate a word, press the ALT button and click on the word in the Value column.

## Need help?

If you have any questions, need help with installing or configuring the plugin, or require assistance with your Medusa project—we are here to help! 

#### About us

<img src="https://rigby-web.fra1.digitaloceanspaces.com/rigby-medusa.svg" alt="Rigby Medusa Expert" width="180">

We are battle-tested Medusa.js Experts & JavaScript Masters - Our software house specializes in B2B & Multi-Vendor Marketplace eCommerce development. 

####  How can we help you?

- **Consulting in the field of strategy development**
- **Composable eCommerce development in Medusa.js**
- **System maintenance and long-term support**
- **Support in ongoing Medusa projects**
- **Medusa Plugin development**
- **Ecommerce & data migration**

Check out our project featured on Medusa: https://medusajs.com/blog/patyna/

####  Contact us

💻 https://rigbyjs.com/en#contact 
📧 hello@rigbyjs.com

## Useful Links

- [Rigby blog](https://rigbyjs.com/en/blog)
- [Medusa website](https://medusajs.com)
- [Community Discord](https://discord.gg/medusajs)
- [Medusa repo](https://github.com/medusajs/medusa/blob/develop/LICENSE)
- [Medusa Docs](https://github.com/medusajs/medusa)
- [Tolgee website](https://tolgee.io/)
- [Tolgee doc](https://tolgee.io/api)

## License

Licensed under the [MIT License](https://github.com/rigby-sh/medusa-multilingual-tolgee/blob/main/LICENSE).
