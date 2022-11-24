import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Vehiculo} from '../models';
import {VehiculoRepository} from '../repositories';

@authenticate("admin", "asesor")
export class VehiculoController {
  constructor(
    @repository(VehiculoRepository)
    public vehiculoRepository: VehiculoRepository,
  ) { }

  @authenticate.skip()
  @post('/vehiculos')
  @response(200, {
    description: 'Vehiculo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vehiculo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {
            title: 'NewVehiculo',
            exclude: ['id'],
          }),
        },
      },
    })
    vehiculo: Omit<Vehiculo, 'id'>,
  ): Promise<Vehiculo> {
    return this.vehiculoRepository.create(vehiculo);
  }

  @get('/vehiculos/count')
  @response(200, {
    description: 'Vehiculo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Vehiculo) where?: Where<Vehiculo>,
  ): Promise<Count> {
    return this.vehiculoRepository.count(where);
  }

  @authenticate.skip()
  @get('/vehiculos') //Consultar vehículos
  @response(200, {
    description: 'Array of Vehiculo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vehiculo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Vehiculo) filter?: Filter<Vehiculo>,
  ): Promise<Vehiculo[]> {
    return this.vehiculoRepository.find(filter);
  }

  @patch('/vehiculos')
  @response(200, {
    description: 'Vehiculo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {partial: true}),
        },
      },
    })
    vehiculo: Vehiculo,
    @param.where(Vehiculo) where?: Where<Vehiculo>,
  ): Promise<Count> {
    return this.vehiculoRepository.updateAll(vehiculo, where);
  }

  @authenticate.skip()
  @get('/vehiculos/{id}')
  @response(200, {
    description: 'Vehiculo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vehiculo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Vehiculo, {exclude: 'where'}) filter?: FilterExcludingWhere<Vehiculo>
  ): Promise<Vehiculo> {
    return this.vehiculoRepository.findById(id, filter);
  }

  @patch('/vehiculos/{id}')
  @response(204, {
    description: 'Vehiculo PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {partial: true}),
        },
      },
    })
    vehiculo: Vehiculo,
  ): Promise<void> {
    await this.vehiculoRepository.updateById(id, vehiculo);
  }

  @put('/vehiculos/{id}') //Actualizar vehículo
  @response(204, {
    description: 'Vehiculo PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() vehiculo: Vehiculo,
  ): Promise<void> {
    await this.vehiculoRepository.replaceById(id, vehiculo);
  }

  @authenticate("admin")
  @del('/vehiculos/{id}')  //Eliminar vehículos
  @response(204, {
    description: 'Vehiculo DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.vehiculoRepository.deleteById(id);
  }
}
