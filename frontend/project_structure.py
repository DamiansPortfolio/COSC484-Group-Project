import os

# List of relevant file extensions and their language identifiers for code blocks
RELEVANT_EXTENSIONS = {
    ".js": "javascript",
    ".jsx": "javascript",
    ".json": "json",
    ".css": "css",
    ".html": "html",
}

# Components to extract content from
SPECIFIC_COMPONENTS = ["Recommendations.jsx", "package.json"]

# SPECIFIC_COMPONENTS = ["QuickStats.jsx", "RecentActivity.jsx", "Recommendations.jsx"]

# Always include these files
INCLUDE_ALWAYS = ["package.json", "index.html"]


def is_relevant_file(filename):
    # Check if the file extension is relevant or if it's one of the always included files
    return (
        any(filename.endswith(ext) for ext in RELEVANT_EXTENSIONS)
        or filename in INCLUDE_ALWAYS
    )


def get_file_content(filepath):
    # Read and return the content of the file
    with open(filepath, "r") as file:
        return file.read()


def load_gitignore(root_dir):
    """Load .gitignore patterns into a list."""
    gitignore_path = os.path.join(root_dir, ".gitignore")
    if not os.path.exists(gitignore_path):
        return []

    with open(gitignore_path, "r") as gitignore_file:
        patterns = [
            line.strip()
            for line in gitignore_file
            if line.strip() and not line.startswith("#")
        ]
    return patterns


def should_ignore(filepath, patterns):
    """Check if a file should be ignored based on .gitignore patterns."""
    for pattern in patterns:
        if pattern in filepath:
            return True
    return False


def generate_tree_structure(root_dir, output_file):
    gitignore_patterns = load_gitignore(root_dir)

    tree_output = []
    file_content_output = []

    tree_output.append(f"# Project Structure for `{root_dir}`\n")

    for root, dirs, files in os.walk(root_dir):
        # Exclude node_modules, package-lock.json, and files/directories in .gitignore
        dirs[:] = [
            d
            for d in dirs
            if d != "node_modules"
            and not should_ignore(os.path.join(root, d), gitignore_patterns)
        ]
        files = [
            file
            for file in files
            if file != "package-lock.json"
            and not should_ignore(os.path.join(root, file), gitignore_patterns)
        ]

        # Filter for relevant files
        relevant_files = [file for file in files if is_relevant_file(file)]

        if relevant_files or dirs:
            # Print folder structure in tree format
            depth = root.replace(root_dir, "").count(os.sep)
            indent = "│   " * depth + "├── "
            tree_output.append(f"{indent}{os.path.basename(root)}/\n")
            for idx, file in enumerate(relevant_files):
                file_indent = "│   " * (depth + 1)
                if idx == len(relevant_files) - 1:
                    file_indent = "│   " * depth + "└── "
                tree_output.append(f"{file_indent}{file}\n")

                # If the file is in the list of specific components, prepare file content output
                if file in SPECIFIC_COMPONENTS:
                    filepath = os.path.join(root, file)
                    relative_path = os.path.relpath(filepath, root_dir)
                    file_extension = os.path.splitext(file)[1]
                    language = RELEVANT_EXTENSIONS.get(
                        file_extension, ""
                    )  # Get the language for the code block
                    content = get_file_content(filepath)

                    # Add the content to the file content output with markdown code block
                    file_content_output.append(f"## {file}\n")
                    file_content_output.append(f"Path: `{relative_path}`\n\n")
                    file_content_output.append(f"```{language}\n{content}\n```\n")
                    file_content_output.append("\n" + "-" * 40 + "\n")

    # Write everything to the output markdown file
    with open(output_file, "w") as f:
        # Write the tree structure first
        f.writelines(tree_output)
        # Then the file contents
        if file_content_output:
            f.write("\n# File Content\n\n")
            f.writelines(file_content_output)


if __name__ == "__main__":
    project_directory = input("Enter your project's root directory: ")
    output_file = "project_structure.md"  # Output markdown file
    generate_tree_structure(project_directory, output_file)
    print(f"Project structure and component contents have been saved to {output_file}")
