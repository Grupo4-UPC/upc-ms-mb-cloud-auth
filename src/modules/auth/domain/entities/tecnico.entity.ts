export class TecnicoEntity {
    constructor(
        public readonly idTecnico: number,
        public readonly usuario: string,
        public readonly password: string,
        public readonly nombre: string,
        public readonly telefono: string | null,
        public readonly estado: boolean,
        public readonly fechaCreacion: Date,
    ) {}

    static create(
        usuario: string,
        password: string,
        nombre: string,
        telefono?: string,
        estado?: boolean,
    ): TecnicoEntity {
        return new TecnicoEntity(
            0,
            usuario,
            password,
            nombre,
            telefono || null,
            estado ?? true,
            new Date(),
        );
    }

    actualizar(
        cambios: Partial<{
            usuario: string;
            password: string;
            nombre: string;
            telefono: string;
            estado: boolean;
        }>,
    ): TecnicoEntity {
        return new TecnicoEntity(
            this.idTecnico,
            cambios.usuario ?? this.usuario,
            cambios.password ?? this.password,
            cambios.nombre ?? this.nombre,
            cambios.telefono ?? this.telefono,
            cambios.estado ?? this.estado,
            this.fechaCreacion,
        );
    }
}