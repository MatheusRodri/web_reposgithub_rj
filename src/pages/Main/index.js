import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { useCallback, useState } from "react";
import api from "../../services/api";

export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleDelete = useCallback((repo) => {
        const find = repositories.filter(r => r.name !== repo);
        setRepositories(find);
    }, [repositories])


    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        async function submit() {
            setLoading(true);
            try {
                const response = await api.get(`/repos/${newRepo}`);
                const data = {
                    name: response.data.full_name,
                }

                setRepositories([...repositories, data]);
                setNewRepo('');
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

        }
        submit();
    }, [newRepo, repositories]);


    function handleInputChange(e) {
        setNewRepo(e.target.value);
    }

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit}>
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
                        <a href="/">
                            <FaBars size={20} />
                        </a>
                    </li>
                ))}
            </List>
        </Container>
    );
}