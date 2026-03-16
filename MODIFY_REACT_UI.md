# SKILL: Modify React UI with Tailwind CSS

This skill provides a systematic workflow to modify the user interface of a React application that uses Tailwind CSS for styling. It automates the process of identifying and updating the correct components and styles.

## Workflow

### 1. Identify the Target Component/Page

- **Action:** Ask the user to specify which page or component they want to modify (e.g., "the login page", "the main navigation bar", "the trip cards on the homepage").
- **Analysis:**
  - Based on the user's description, locate the corresponding file in the `src/pages/` or `src/components/` directory.
  - **Tooling:** Use `file_search` or `semantic_search` if the file name isn't immediately obvious. For example, search for "Login Form" to find `LoginPage.js`.

### 2. Read the Component's Code

- **Action:** Once the target file is identified, read its full content.
- **Analysis:**
  - Examine the JSX structure to understand how the component is built.
  - Pay close attention to the `className` attributes to see which Tailwind CSS utility classes are currently applied.
  - **Tooling:** Use `read_file` on the identified component file.

### 3. Determine the Changes

- **Action:** Ask the user for the specific visual changes they want to make. Examples:
  - "Change the primary button color to blue."
  - "Make the page title font larger."
  - "Add more spacing between the input fields."
- **Analysis:**
  - Translate the user's request into specific Tailwind CSS class modifications.
    - "Change color to blue" -> Replace `bg-gray-500` with `bg-blue-600`.
    - "Make font larger" -> Change `text-2xl` to `text-4xl`.
    - "Add spacing" -> Add `mt-4` or change `space-y-2` to `space-y-4`.

### 4. Apply the Changes Automatically

- **Action:** Use the `replace_string_in_file` tool to apply the identified class changes directly to the component file.
- **Process:**
  1.  Construct the `oldString` by taking the entire line (or lines) containing the `className` that needs to be changed. Include enough context (surrounding JSX) to ensure the replacement is unique.
  2.  Construct the `newString` with the updated Tailwind CSS classes.
  3.  Execute the file modification.
- **Example:**
  - **User Request:** "Change the login button color from gray to green."
  - **Analysis:** Find `<button className="... bg-gray-800 ...">`.
  - **Tool Call:**
    ```json
    "tool_code": "tools.replace_string_in_file(filePath='c:/.../LoginPage.js', oldString='<button className=\"w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 ...\">', newString='<button className=\"w-full py-2 px-4 bg-green-600 hover:bg-green-500 ...\">')"
    ```

### 5. Confirm and Report

- **Action:** After the tool successfully modifies the file, inform the user that the change has been applied.
- **Output:** "I have updated the styles in `[file.js](file.js)`. The button color should now be green. Please check your browser to see the result."

## Principles

- **Targeted:** Focus on one component/change at a time for accuracy.
- **Automated:** Leverage file editing tools to directly implement changes, reducing manual work for the user.
- **Context-Aware:** Use existing class names and project structure (Tailwind CSS) as the basis for modifications.
