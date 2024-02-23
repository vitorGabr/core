export default {
	globals: {
		usert_types: {
			admin: "Admin",
			default: "Cliente",
			manager: "Gerente",
			realtor: "Corretor",
			test: 'Teste {name} {a}',
			nested: {
				deep: {
					key: 'Deep key',
				},
			}
		},
	},
} as const;
