import subprocess
import os


def git_blame_for_file(file_path, username):
    try:
        command = f"git blame {file_path} | grep -i {username}"
        blame_output = subprocess.check_output(
            command,
            stderr=subprocess.STDOUT,
            shell=True
        ).decode('utf-8').strip()

        return f"\n{file_path}\n{blame_output}".strip()

    except subprocess.CalledProcessError:
        return ""


def recursive_git_blame(directory, username, ignore_dirs=[], ignore_files=[], ignore_extensions=[]):
    results = []
    unique_files = set()
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            ext = f.split('.')[-1]
            if ext in ignore_extensions:
                continue
            if f in ignore_files:
                continue

            file_path = os.path.join(root, f)
            unique_files.add(file_path)
            blame_output = git_blame_for_file(file_path, username)
            if blame_output:
                results.append(blame_output)

    return ("\n\n".join(results), unique_files)


if __name__ == "__main__":
    netid = input("Enter your NetID: ").lower()
    username = input("Enter your GitHub username: ").lower()
    sprint_num = int(input("Enter the sprint number: "))

    directories_to_ignore = ['venv', 'node_modules', 'public', 'build', '__pycache__']
    files_to_ignore = ['package-lock.json', '.gitignore']
    extensions_to_ignore = ['svg', 'env']

    frontend_result, frontend_files = recursive_git_blame(
        'frontend',
        username,
        ignore_dirs=directories_to_ignore,
        ignore_files=files_to_ignore,
        ignore_extensions=extensions_to_ignore
    )

    backend_result, backend_files = recursive_git_blame(
        'backend',
        username,
        ignore_dirs=directories_to_ignore,
        ignore_files=files_to_ignore,
        ignore_extensions=extensions_to_ignore
    )
    result = frontend_result + backend_result
    all_files = "\n".join(frontend_files.union(backend_files))
    with open(f"sprint{sprint_num}/{netid}.commits.txt", 'w') as fl:
        fl.write(result)

    print(f"\nFiles worked on:\n{all_files}")