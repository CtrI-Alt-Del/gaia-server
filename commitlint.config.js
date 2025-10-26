module.exports = {
	extends: ["@commitlint/config-conventional"],

	/**
	 * PASSO 1: Definir o nosso plugin inline.
	 * O commitlint vai carregar isto e "aprender" a nossa nova regra.
	 */
	plugins: [
		{
			/**
			 * Aqui definimos as regras que este plugin oferece.
			 * Vamos criar a regra 'subject-ticket-pattern'.
			 */
			rules: {
				/**
				 * O nome da nossa regra customizada.
				 * @param {object} parsed - O commit "parseado", 
				 * contém { type, scope, subject, header, ... }
				 */
				"subject-ticket-pattern": (parsed) => {
					// Extraímos o 'subject' (o texto após os dois pontos)
					const subject = parsed.subject || '';

					// O padrão RegExp que queremos forçar:
					// ^        -> Início do "subject"
					// #        -> Caractere literal '#'
					// [A-Z]+   -> ID do projeto (letras maiúsculas, ex: GAIA)
					// -        -> Hífen literal
					// \d+      -> Número do ticket (dígitos, ex: 138)
					// \s       -> Um espaço
					// .+       -> A descrição (pelo menos 1 caractere)
					const regex = /^#[A-Z]+-\d+\s.+/;

					// Verificamos se o 'subject' bate com o nosso padrão
					if (regex.test(subject)) {
						// Se passar, retorna [true]
						return [true, ''];
					}

					// Se falhar, retorna [false, "mensagem de erro"]
					return [
						false,
						`O "subject" deve seguir o formato: #TICKET-ID descrição (ex: #GAIA-138 add data parser)`,
					];
				},
			},
		},
	],

	/**
	 * PASSO 2: Aplicar as regras.
	 * Agora que o commitlint "sabe" o que é a 'subject-ticket-pattern',
	 * podemos usá-la aqui.
	 */
	rules: {
		/**
		 * Mantemos a tua regra original para os tipos.
		 */
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"test",
				"chore",
				"ci",
				"merge",
			],
		],

		/**
		 * Desativar a regra 'subject-case'.
		 * A config-conventional exige 'lower-case', mas o nosso
		 * padrão começa com '#', o que falharia a regra.
		 * Nível 0 = Desativado.
		 */
		"subject-case": [0, "always"],

		/**
		 * Ativar a nossa regra customizada 'subject-ticket-pattern'.
		 * Nível 2 = Erro (falha o commit se não seguir o padrão).
		 */
		"subject-ticket-pattern": [2, "always"],
	},
};
