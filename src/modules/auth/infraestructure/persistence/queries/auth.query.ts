export const AUTH_QUERY = {
    FIND_USER_BY_USERNAME: `
        SELECT 
            id_tecnico, 
            usuario, 
            password, 
            nombre, 
            telefono, 
            estado, 
            fecha_creacion,
            tipo_documento,
            num_documento
        FROM tecnicos
        WHERE usuario = $1 AND estado = true
    `
};
