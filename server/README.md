## Local development environment
  - Run `docker-compose up -d`
  - Database can be accessed at localhost:5432, pgadmin/pgadmin, DB name "gis"
  - Geoserver http://localhost:8080/geoserver, admin/geoserver
  - Postgres and Geoserver data will be saved inside ./docker_data folder

## Copy data from AWS into local environment

  - Open up bash inside postgis container `docker-compose exec postgis bash`
  - Create a dump of the remote database `pg_dump --host=AWS_HOST --table=katu --clean --username=AWS_PG_USER AWS_PG_DB > db.dump`
  - Restore dump into local database `psql --host=localhost --username=pgadmin gis < db.dump`

## Setup Geoserver

1. Open http://localhost:8080/geoserver and login (admin/geoserver)
2. Create new workspace
  -- Go to Workspaces
  -- Add new Workspace
  -- name: espoo
  -- namespace URI: espoo
  -- check default workspace
3. Create new store
  -- Go to Stores
  -- Add new Store
  -- Select PostGIS
  -- Name: Espoo AWS GIS
  -- Host: postgis
  -- Database: gis
  -- User: pgadmin
  -- Passwd: pgadmin
  -- Save
4. Publish layer
  -- Go to layers
  -- Add a new layer
  -- Add layer from: espoo:Espoo AWS GIS
  -- Click publish
  -- Declared SRS: EPSG:3857
  -- SRS handling: Reproject native to declared
  -- From Bounding Boxes -section, click Compute from data and Compute from native bounds
  -- Click reload feature type
  -- Save
