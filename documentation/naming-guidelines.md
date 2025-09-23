## 📜 Naming Convention Guidelines

Following a consistent naming convention is crucial for maintaining clean, readable, and maintainable code. This document outlines the standards for this project.

---

### Casing Styles Explained

* **PascalCase**: Words are joined together, and the first letter of each word is capitalized.
    * *Example: `UserProfile`, `DatabaseConnection`*
* **camelCase**: Words are joined together. The first letter of the first word is lowercase, while the first letter of every subsequent word is capitalized.
    * *Example: `userName`, `calculateTotalAmount`*
* **kebab-case**: All words are lowercase and separated by a hyphen (`-`).
    * *Example: `user-profile.service.ts`, `app-routing.module.css`*

---

### Project-Specific Rules

#### 1. Files and Directories 📁

All file and directory names **must** use **kebab-case**. This improves readability in the file system, especially in URLs.

* ✅ **Good:** `user-profile.tsx`, `api-helpers.ts`, `auth-service`
* ❌ **Bad:** `UserProfile.tsx`, `apiHelpers.ts`, `auth_service`

#### 2. Variables and Functions ⚙️

All variable and function names **must** use **camelCase**. This is the standard for most modern programming languages like JavaScript, TypeScript, and Java.

* **Variables:**
    * ✅ **Good:** `const userToken = ...`, `let itemCount = 0;`
    * ❌ **Bad:** `const UserToken = ...`, `let item_count = 0;`
* **Functions:**
    * ✅ **Good:** `function getUserById() { ... }`, `const calculatePrice = () => { ... }`
    * ❌ **Bad:** `function GetUserById() { ... }`, `const calculate_price = () => { ... }`

#### 3. Classes, Interfaces, Types, and Components ✨

All classes, interfaces, custom types, and UI components **must** use **PascalCase**. This helps distinguish them from regular variables and functions.

* ✅ **Good:** `class AuthService { ... }`, `interface UserProfile { ... }`, `type AppConfig = { ... }`
* ❌ **Bad:** `class authService { ... }`, `interface userProfile { ... }`, `type app-config = { ... }`

---

Adhering to these guidelines will ensure our codebase remains consistent and easy to navigate for everyone on the team.
