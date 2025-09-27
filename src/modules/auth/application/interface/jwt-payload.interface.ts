export interface JwtPayload {
  sub: number;           // ID del usuario (claim estándar)
  usuario: string;       // Nombre de usuario
  nombre: string;        // Nombre completo
  role: string;          // Rol del usuario
  menu: string[];        // Permisos/menús disponibles
  iat?: number;          // Issued at (agregado automáticamente por JWT)
  exp?: number;          // Expiration time (agregado automáticamente por JWT)
}