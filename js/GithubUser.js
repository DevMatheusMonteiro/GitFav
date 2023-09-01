export class GithubUser {
  static search(userLogin) {
    return fetch(`https://api.github.com/users/${userLogin}`)
      .then((data) => data.json())
      .then(({ name, login, public_repos, followers }) => ({
        name,
        login,
        public_repos,
        followers,
      }));
  }
}
