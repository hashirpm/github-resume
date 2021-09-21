
## Steps To Follow

- Select an issue and ask to be _assigned_ to it.
- Check the code.
- **Star** this repository.
- On the [github-resume](https://github.com/hashirpm/github-resume) repo page, click the **Fork** button.
    <br><img src="https://help.github.com/assets/images/help/repository/fork_button.jpg" title="Fork image" width="400"/>
- **Clone** your forked repository to your local machine. This button will show you the URL to run.
    <br><img src="https://docs.github.com/assets/images/help/repository/code-button.png" title="Code button" width="400"/>

    For example, run this command inside your terminal:

    ```bash
    git clone https://github.com/<your-github-username>/github-resume.git
    ```

    **Replace \<your-github-username\>!**

    Learn more about [forking](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [cloning a repo](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).


- Checkout to development branch (*name your branch according to the issue name*).

    ```bash
    git checkout -b <branch-name>
    ```

- Add the changes with `git add`, `git commit` ([write a good commit message](https://chris.beams.io/posts/git-commit/), if possible):

    ```bash
    git add -A
    git commit -m "<your message>"
    ```

- Push the code _to your repository_.

    ```bash
    git push origin <branch-name>
    ```

- Go to the GitHub page of _your fork_, and **make a pull request**:

    ![pull request image](https://help.github.com/assets/images/help/pull_requests/choose-base-and-compare-branches.png)

    Read more about pull requests on the [GitHub help pages](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
- Now wait, until one of us *reviews your Pull Request*! If there are any conflicts, you will get a notification.


