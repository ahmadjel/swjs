# jelmix Blogger Template - README

**Version:** 1.0.0
**Author:** Jules

## 1. Introduction

Welcome to **jelmix**, a high-performance, SEO-optimized, and modern Blogger theme. This template was built from the ground up with a focus on clean code, fast loading speeds, and a professional, minimalist design. It merges the best features from modern blog designs while discarding technical debt, resulting in a theme that is both powerful and easy to maintain.

This document provides all the necessary instructions for installing and customizing the jelmix template for your own Blogger site.

## 2. Installation

Installing the jelmix template is a straightforward process. Follow these steps carefully:

1.  **Download the Template:** Make sure you have the `jelmix_template.xml` file on your local machine.
2.  **Back-Up Your Current Theme:** Before proceeding, it is **highly recommended** to back up your existing theme.
    *   Go to your Blogger Dashboard.
    *   Navigate to **Theme**.
    *   Click the three-dots icon in the top-right corner and select **Backup**.
    *   Download and save the `.xml` file.
3.  **Upload the jelmix Template:**
    *   On the same **Theme** page, click the three-dots icon again and select **Restore**.
    *   Click **Upload** and select the `jelmix_template.xml` file you downloaded.
    *   The new theme will be applied to your blog.

Your blog should now be running the jelmix theme!

## 3. Customization

jelmix is designed to be easily customizable directly from the Blogger Theme Designer and by editing the XML file for more advanced changes.

### 3.1. Basic Customization (Theme Designer)

For most visual changes, you can use Blogger's built-in Theme Designer.

1.  From your Blogger Dashboard, go to **Theme**.
2.  Click the **Customize** button.
3.  Here you can modify:
    *   **Colors:** The main theme colors, text colors, and background colors are all linked to the CSS variables in the template.
    *   **Fonts:** Change the primary and secondary fonts used throughout the site.
    *   **Layout:** Adjust the width of the main content area and sidebar.

#### 3.1.1. Dark Mode Toggle
The theme includes a functional dark mode. To enable or disable it by default, you can find and modify the JavaScript variables within the template.

#### 3.1.2. Author Box
The author box on single post pages is automatically populated from the author's Blogger profile. Ensure that the author has filled out their profile information, including a bio and profile picture, in the Blogger settings.

### 3.2. Advanced Customization (Editing HTML)

For more in-depth changes, you will need to edit the theme's XML.

1.  From the **Theme** page, click the three-dots icon and select **Edit HTML**.
2.  You will see the entire `jelmix_template.xml` file.

#### 3.2.1. Changing CSS Variables

All theme colors, fonts, and major spacing are controlled by CSS variables located at the top of the `<b:skin>` section. You can easily find and modify them.

```css
/* Find this section in the <b:skin><![CDATA[...]]></b:skin> tag */

:root {
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-secondary: 'Georgia', serif;

  --color-primary: #1A73E8;
  --color-primary-dark: #1254A8;

  /* ... and so on ... */
}
```

Simply change the values here to update the look and feel of your entire site.

#### 3.2.2. Configuring Widgets

You can add, remove, and configure widgets from the **Layout** section of your Blogger Dashboard. The jelmix theme includes standard widget areas:

*   **Header:** For your blog's title or logo.
*   **Sidebar:** For gadgets like "Popular Posts," "Labels," or an "About Me" widget.
*   **Footer:** For copyright information or additional links.

#### 3.2.3. Social Media Links

To add your social media links, go to the **Layout** page and find the "Social Media" widget (if one is pre-configured) or add a new **Link List** widget. Add links with the name of the social media platform (e.g., `Twitter`, `Instagram`, `Facebook`) and the widget will automatically display the correct icon.

## 4. JavaScript and Performance

The jelmix theme uses modern, vanilla ES6+ JavaScript for all its functionalities to ensure the fastest possible performance. Key features include:

*   **Responsive Navigation:** The mobile menu is lightweight and dependency-free.
*   **Lazy Loading:** Images use the `IntersectionObserver` API to lazy load, which significantly improves page load times.

All scripts are contained within the main `jelmix_template.xml` file and are optimized for performance. It is not recommended to add heavy external JavaScript libraries like jQuery, as this will negatively impact the site's speed.

## 5. Support

This theme was developed by Jules. While it is provided as-is, the code is heavily commented to assist developers in making custom modifications. For any issues related to the core functionality, please refer back to this documentation.

Thank you for using jelmix!
