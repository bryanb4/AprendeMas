--
-- PostgreSQL database dump
--

\restrict 3exlcLxxPwXCOiUSGufUmzpR8ftc0Azgiddo1XeXhPqhaHrpJ5hcPxwvF1OW9ez

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-18 19:14:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16453)
-- Name: materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    nombre character varying(100),
    descripcion text,
    icon character varying(10)
);


ALTER TABLE public.materias OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16452)
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materias_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 221
-- Name: materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_id_seq OWNED BY public.materias.id;


--
-- TOC entry 228 (class 1259 OID 24725)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    temas_id integer NOT NULL,
    content text NOT NULL,
    options jsonb NOT NULL,
    correct_option text NOT NULL,
    explanation text NOT NULL,
    rating integer DEFAULT 1200 NOT NULL,
    status character varying(20) DEFAULT 'pending_review'::character varying NOT NULL,
    created_by character varying(50) DEFAULT 'ai_cerebras'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24724)
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questions_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 227
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- TOC entry 226 (class 1259 OID 16478)
-- Name: resultados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultados (
    id integer NOT NULL,
    usuario_id integer,
    calificacion integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resultados OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16477)
-- Name: resultados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resultados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultados_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 225
-- Name: resultados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resultados_id_seq OWNED BY public.resultados.id;


--
-- TOC entry 224 (class 1259 OID 16463)
-- Name: temas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temas (
    id integer NOT NULL,
    materia_id integer,
    nombre text
);


ALTER TABLE public.temas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16462)
-- Name: temas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.temas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.temas_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 223
-- Name: temas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.temas_id_seq OWNED BY public.temas.id;


--
-- TOC entry 229 (class 1259 OID 24753)
-- Name: user_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_ratings (
    usuarios_id integer NOT NULL,
    materias_id integer NOT NULL,
    rating integer DEFAULT 1000 NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_ratings OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24774)
-- Name: user_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_responses (
    id integer NOT NULL,
    usuarios_id integer,
    question_id integer,
    selected_option character(1) NOT NULL,
    is_correct boolean NOT NULL,
    old_user_rating integer NOT NULL,
    new_user_rating integer NOT NULL,
    question_rating_snap integer NOT NULL,
    answered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_responses OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24773)
-- Name: user_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_responses_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_responses_id_seq OWNED BY public.user_responses.id;


--
-- TOC entry 220 (class 1259 OID 16428)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    primer_apellido character varying(100) NOT NULL,
    segundo_apellido character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    institucion character varying(200) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16427)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4786 (class 2604 OID 16456)
-- Name: materias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias ALTER COLUMN id SET DEFAULT nextval('public.materias_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 24728)
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16481)
-- Name: resultados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados ALTER COLUMN id SET DEFAULT nextval('public.resultados_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 16466)
-- Name: temas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temas ALTER COLUMN id SET DEFAULT nextval('public.temas_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 24777)
-- Name: user_responses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_responses ALTER COLUMN id SET DEFAULT nextval('public.user_responses_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16431)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4973 (class 0 OID 16453)
-- Dependencies: 222
-- Data for Name: materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materias (id, nombre, descripcion, icon) FROM stdin;
\.


--
-- TOC entry 4979 (class 0 OID 24725)
-- Dependencies: 228
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, temas_id, content, options, correct_option, explanation, rating, status, created_by, created_at) FROM stdin;
\.


--
-- TOC entry 4977 (class 0 OID 16478)
-- Dependencies: 226
-- Data for Name: resultados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultados (id, usuario_id, calificacion, fecha) FROM stdin;
\.


--
-- TOC entry 4975 (class 0 OID 16463)
-- Dependencies: 224
-- Data for Name: temas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temas (id, materia_id, nombre) FROM stdin;
\.


--
-- TOC entry 4980 (class 0 OID 24753)
-- Dependencies: 229
-- Data for Name: user_ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_ratings (usuarios_id, materias_id, rating, updated_at) FROM stdin;
\.


--
-- TOC entry 4982 (class 0 OID 24774)
-- Dependencies: 231
-- Data for Name: user_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_responses (id, usuarios_id, question_id, selected_option, is_correct, old_user_rating, new_user_rating, question_rating_snap, answered_at) FROM stdin;
\.


--
-- TOC entry 4971 (class 0 OID 16428)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, institucion, email, password, created_at) FROM stdin;
4	Juan	cbhude	brtdgtbf	2026-03-13	hbtrsrtg	car@gmail.com	$2b$10$LkEhX5RX1FgHjoCdCYDghOJCJMaVTLoZG9RDevDZiY1p93bRWOo/G	2026-03-17 21:04:57.204373
5	ana	vrfesvb	edbgvrevb	2026-03-03	vgrevrev	ana@gmail.com	$2b$10$qGJohE12HnN.Gr/A7CdKEOzdY17L66rUMLhdb8KwbV1Qe34nI1sBa	2026-03-17 21:47:03.485748
\.


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 221
-- Name: materias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materias_id_seq', 1, false);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 227
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 1, false);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 225
-- Name: resultados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resultados_id_seq', 1, false);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 223
-- Name: temas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.temas_id_seq', 1, false);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_responses_id_seq', 1, false);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 5, true);


--
-- TOC entry 4804 (class 2606 OID 16461)
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 24746)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 4808 (class 2606 OID 16485)
-- Name: resultados resultados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16471)
-- Name: temas temas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temas
    ADD CONSTRAINT temas_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 24762)
-- Name: user_ratings user_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ratings
    ADD CONSTRAINT user_ratings_pkey PRIMARY KEY (usuarios_id, materias_id);


--
-- TOC entry 4815 (class 2606 OID 24786)
-- Name: user_responses user_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_responses
    ADD CONSTRAINT user_responses_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16446)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4802 (class 2606 OID 16444)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4809 (class 1259 OID 24752)
-- Name: idx_questions_matching_approved; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_questions_matching_approved ON public.questions USING btree (temas_id, rating) WHERE ((status)::text = 'approved'::text);


--
-- TOC entry 4818 (class 2606 OID 24747)
-- Name: questions questions_temas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_temas_id_fkey FOREIGN KEY (temas_id) REFERENCES public.temas(id) ON DELETE RESTRICT;


--
-- TOC entry 4817 (class 2606 OID 16486)
-- Name: resultados resultados_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4816 (class 2606 OID 16472)
-- Name: temas temas_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temas
    ADD CONSTRAINT temas_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- TOC entry 4819 (class 2606 OID 24768)
-- Name: user_ratings user_ratings_materias_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ratings
    ADD CONSTRAINT user_ratings_materias_id_fkey FOREIGN KEY (materias_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 24763)
-- Name: user_ratings user_ratings_usuarios_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ratings
    ADD CONSTRAINT user_ratings_usuarios_id_fkey FOREIGN KEY (usuarios_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4821 (class 2606 OID 24792)
-- Name: user_responses user_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_responses
    ADD CONSTRAINT user_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE RESTRICT;


--
-- TOC entry 4822 (class 2606 OID 24787)
-- Name: user_responses user_responses_usuarios_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_responses
    ADD CONSTRAINT user_responses_usuarios_id_fkey FOREIGN KEY (usuarios_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-05-18 19:14:04

--
-- PostgreSQL database dump complete
--

\unrestrict 3exlcLxxPwXCOiUSGufUmzpR8ftc0Azgiddo1XeXhPqhaHrpJ5hcPxwvF1OW9ez

