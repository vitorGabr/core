export default {
	globals: {
		usert_types: {
			admin: "Admin2",
			default: "Cliente",
			manager: "Gerente",
			test: 'Teste {name} {a}',
			nested: {
				deep: {
					key: 'Deep key',
				},
			}
		},
	},
} as const;
