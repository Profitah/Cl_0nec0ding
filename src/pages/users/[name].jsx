import fetch from "isomorphic-unfetch";
import css from "styled-jsx/css"; 
import Profile from "../../components/Profile";
import Repositories from "../../components/Repositories";

const style = css`
  .user-contents-wrapper {
    display: flex;
    padding: 20px;
  }
`;

const name = ({ user, repos }) => {

  return (
    <div className="user-contents-wrapper">
        <Profile user={user} />
        <Repositories user={user} repos={repos} />
        <style jsx>{style}</style>
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  const { name } = query;
  try {
    const userRes = await fetch(`https://api.github.com/users/${name}`);
    if (userRes.status !== 200) {
      return { props: { user: null, repos: [] } };
    }
    const user = await userRes.json();
    
    const reposRes = await fetch(`https://api.github.com/users/${name}/repos?sort=updated&page=1&per_page=10`);
    if (reposRes.status !== 200) {
      return { props: { user, repos: [] } };
    }
    const repos = await reposRes.json();
    
    return { props: { user, repos } };
  } catch (e) {
    console.log(e);
    return { props: { user: null, repos: [] } };
  }
};

export default name;
