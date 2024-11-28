import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    //DidMount
    useEffect(() => {
        const repo = localStorage.getItem('repositories');
        if (repo) {
            setRepositories(JSON.parse(repo));
        }
    }, []);

    //DidUpdate

    useEffect(() => {
        localStorage.setItem('repositories', JSON.stringify(repositories));
    }, [repositories]);


    const handleDelete = useCallback((repo) => {
        const find = repositories.filter(r => r.name !== repo);
        setRepositories(find);
    }, [repositories])


    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        async function submit() {
            setLoading(true);
            setAlert(null);
            try {

                if (newRepo === '') {
                    throw new Error('Você precisa indicar um repositório');
                }

                const response = await api.get(`/repos/${newRepo}`);

                const hasRepo = repositories.find(repo => repo.name === newRepo);

                if (hasRepo) {
                    throw new Error('Repositório duplicado');
                }

                const data = {
                    name: response.data.full_name,
                }

                setRepositories([...repositories, data]);
                setNewRepo('');

            } catch (error) {
                setAlert(true);
                console.log(error.message);
            } finally {
                setLoading(false);
            }

        }
        submit();
    }, [newRepo, repositories]);


    function handleInputChange(e) {
        setNewRepo(e.target.value);
        setAlert(null);
    }

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert} >
                <input
                    type="text"
                    placeholder="Adicionar repositório"
                    value={newRepo}
                    onChange={handleInputChange}
                />
                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )
                    }
                </SubmitButton>
            </Form>

            <List>
                {repositories.map(repository => (
                    <li key={repository.name}>
                        <span>
                            <DeleteButton onClick={() => { handleDelete(repository.name) }} >
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repository.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repository.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    );
}