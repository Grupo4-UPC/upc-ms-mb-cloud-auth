export class TecnicoEntity {
    constructor(
        public readonly idTecnico: number,
        public readonly usuario: string,
        public readonly password: string,
        public readonly nombre: string,
        public readonly telefono: string | null,
        public readonly estado: boolean,
        public readonly fechaCreacion: Date,
        public readonly tipo_documento: string,
        public readonly num_documento: string,
    ) { }

    static create(
        usuario: string,
        password: string,
        nombre: string,
        tipo_documento: string,
        num_documento: string,
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
            tipo_documento,
            num_documento
        );
    }

    actualizar(
        cambios: Partial<{
            usuario: string;
            password: string;
            nombre: string;
            telefono: string;
            estado: boolean;
            tipo_documento: string;
            num_documento: string;
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
            cambios.tipo_documento ?? this.tipo_documento,
            cambios.num_documento ?? this.num_documento
        );
    }
}