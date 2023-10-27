import subprocess
import os
from datetime import datetime
import sys
import re

"""
Internal project tool for Fragrance Finder.

Creates a proper commits.txt file for a sprint and prints
edited files to the console.
"""

IGNORED_DIRECTORIES = [
    'venv',
    'node_modules',
    'public',
    'build',
    '__pycache__',
    '.git'
]

IGNORED_FILES = [
    'package-lock.json',
    '.gitignore',
    '.DS_Store'
]

IGNORED_EXTENSIONS = [
    'svg',
    'env'
]


def extract_date(s):
    pattern = r'\b(\d{4}-\d{2}-\d{2})\b'
    match = re.search(pattern, s)
    return match.group(1) if match else None


def git_blame_for_file(file_path, username, start_date):
    try:
        command = f"git blame {file_path} | grep -i {username}"
        blame_output = subprocess.check_output(
            command,
            stderr=subprocess.STDOUT,
            shell=True
        ).decode('utf-8').strip()

        if start_date:
            date_specific_output = []
            for line in blame_output.split('\n'):
                date = extract_date(line)
                if date is None:
                    continue

                date = datetime.strptime(date, '%Y-%m-%d').date()
                if date >= start_date:
                    date_specific_output.append(line)

            blame_output = "\n".join(date_specific_output).strip()

        if blame_output:
            return f"\n{file_path}\n{blame_output}"

        return None

    except subprocess.CalledProcessError:
        return ""


def recursive_git_blame(directory, username, start_date):
    results = []
    unique_files = set()
    for root, dirs, files in os.walk(directory):
        dirs[:] = [
            d for d in dirs if
            d not in IGNORED_DIRECTORIES and 'sprint' not in d
        ]
        for f in files:
            ext = f.split('.')[-1]
            if ext in IGNORED_EXTENSIONS:
                continue
            if f in IGNORED_FILES:
                continue

            file_path = os.path.join(root, f)
            blame_output = git_blame_for_file(file_path, username, start_date)
            if blame_output:
                unique_files.add(
                    file_path
                    .replace('./', '')
                    .replace('.\\', '')
                )
                results.append(blame_output)

    return ("\n\n".join(results), unique_files)


if __name__ == "__main__":
    netid = input("Enter your NetID: ").lower().strip()
    username = input("Enter your GitHub username: ").lower().strip()
    sprint_num = int(input("Enter the sprint number: "))
    start_date = input(
        "Enter the sprint start date in YYYY-MM-DD format (ENTER to ignore): "
    ).strip()

    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        except ValueError:
            print(f"ERROR: Invalid date format '{start_date}'.\
                  Format must be YYYY-MM-DDD.")
            sys.exit()

    result, files = recursive_git_blame(
        '.',
        username,
        start_date
    )

    files_string = "\n".join(files)
    with open(f"sprint{sprint_num}/{netid}.commits.txt", 'w') as fl:
        fl.write(result.strip())

    print(f"\nFiles worked on:\n{files_string}")