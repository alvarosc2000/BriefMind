--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-14 20:26:10

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24596)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    project_id integer NOT NULL,
    payment_date date NOT NULL,
    payment_amount numeric(12,2) NOT NULL,
    payment_method character varying(50),
    payment_status character varying(50)
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24595)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 219
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 218 (class 1259 OID 24587)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    client_name character varying(255) NOT NULL,
    project_name character varying(255) NOT NULL,
    start_date date NOT NULL,
    delivery_date date NOT NULL,
    website text,
    main_goal text NOT NULL,
    secondary_goals text,
    current_situation text NOT NULL,
    challenges text,
    target_audience text NOT NULL,
    audience_needs text NOT NULL,
    main_message text NOT NULL,
    differentiation text NOT NULL,
    tone character varying(50) NOT NULL,
    channels text[],
    deliverable_formats text[],
    expected_deliverables text,
    limitations text,
    competitors text,
    reference_links text,
    budget character varying(100),
    resources text,
    milestones text,
    deadlines text,
    restrictions text,
    notes text,
    branding_links text,
    final_format character varying(100),
    user_id integer,
    generated_brief text
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24586)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 217
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 222 (class 1259 OID 24608)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    role text DEFAULT 'client'::text,
    created_at timestamp without time zone DEFAULT now(),
    briefs_available integer DEFAULT 0,
    briefs_renewal_date date
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24607)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4753 (class 2604 OID 24599)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 24590)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 24611)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4916 (class 0 OID 24596)
-- Dependencies: 220
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, project_id, payment_date, payment_amount, payment_method, payment_status) FROM stdin;
\.


--
-- TOC entry 4914 (class 0 OID 24587)
-- Dependencies: 218
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, client_name, project_name, start_date, delivery_date, website, main_goal, secondary_goals, current_situation, challenges, target_audience, audience_needs, main_message, differentiation, tone, channels, deliverable_formats, expected_deliverables, limitations, competitors, reference_links, budget, resources, milestones, deadlines, restrictions, notes, branding_links, final_format, user_id, generated_brief) FROM stdin;
1	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	1	\N
3	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
4	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
5	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
6	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
7	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
8	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
9	a		2025-06-15	2025-06-22											{}	{}													3	\N
10	adsadsa	dsa	2025-06-14	2025-06-22											{}	{}													3	\N
11	asdas	dasdas	2025-06-15	2025-06-29											{}	{}													3	\N
12			2025-06-14	2025-06-22											{}	{}													3	\N
13	Cliente Test	Campaña 2025	2025-06-01	2025-07-01	https://cliente.com	Lanzar nuevo producto	Brand awareness	Necesita más presencia online	Competencia fuerte	Millennials	Innovación y buen precio	Somos diferentes	Tecnología propia	Inspirador	{Instagram,LinkedIn}	{Videos,Posts}	3 reels y 10 posts	Sin presupuesto para ads	Competidor A	https://ejemplo.com/referencia	1500 USD	Diseñador interno	Campaña en julio	2025-07-15	No usar colores oscuros	Cliente exigente con diseño	https://drive.com/folder	PDF	3	\N
\.


--
-- TOC entry 4918 (class 0 OID 24608)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at, briefs_available, briefs_renewal_date) FROM stdin;
2	Usuario Dos	usuario2@example.com	$2b$10$hFtWjTq89YbVHJXTa0vF.eI7ZZjzPZXYe/0OYkzKQmZwwzvMfRl3C	user	2025-06-13 00:18:11.417119	0	\N
4	pepe	as@gmail.com	$2b$10$byyb2W0w.vU2nHMz3x/ffu3sXTrhLCzlpSb1pZVTi5eUykRshEMNG	client	2025-06-13 18:49:59.126162	0	\N
5	p	ds@gmail.com	$2b$10$/zYc2FrQ54ZHarcSyTTmIOvnpvE4iq1CNpL2IFwWC2ggWsr95pRQ2	client	2025-06-14 18:04:20.526111	0	\N
1	Usuario Uno	usuario1@example.com	$2b$10$KIXcJ7N3QDy8Y7pYXrtw7uB0l0P5P7b8mR2gK9upK0pU3ZqoxxZna	admin	2025-06-13 00:18:11.417119	3	\N
3	a	alvaroscriado@gmail.com	$2b$10$uBidgXTDTVUr3II7pme.V.DB7D7wi9jeXq/Nq5TJ8723AutXhdB7i	client	2025-06-13 18:42:53.680278	1	\N
\.


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 219
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 217
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 14, true);


--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 4761 (class 2606 OID 24601)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 2606 OID 24594)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 24619)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4765 (class 2606 OID 24617)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 24602)
-- Name: payments payments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4766 (class 2606 OID 24620)
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-06-14 20:26:10

--
-- PostgreSQL database dump complete
--

