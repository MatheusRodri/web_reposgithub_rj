import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { Container, Owner, Loading, BackButton } from "./styles";
import api from '../../services/api';
import { FaArrowLeft } from "react-icons/fa";



export default function Repository({ match }) {
    const { repositorioParamName } = useParams();

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getRepo() {
            const nomeRepo = decodeURIComponent(repositorioParamName);

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);
            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }
        getRepo();
    }, []);



    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }
    return (
        <Container>

            <BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </BackButton>




            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>
        </Container>
    );
}
