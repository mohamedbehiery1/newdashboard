import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Box } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { useTranslation } from 'react-i18next';
import createMap, { mapControls } from 'src/__services__/mapService';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { has, head, isEmpty, pick } from "lodash";
import ZoneDetails from "./components/ZoneDetails";
import ZoneService from 'src/__services__/ZoneService';
import AuthService from "src/__services__/AuthService";

const ZoneList = () => {
  const { i18n } = useTranslation();
  const { role } = AuthService.getCurrentUser()

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [draw, setDraw] = useState(
    new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: false,
        line_string: false,
        polygon: true,
        trash: false,
        combine_features: false,
        uncombine_features: false
      },
      defaultMode: 'simple_select',
      userProperties: true,
    })
  )

  const [zones, setZones] = useState([]);

  useEffect(_ => {
    try {
      // draw.deleteAll();
      setTimeout(_ => zones.forEach(zone => draw.add(zone)), 300)
    } catch (e) {
      console.log(e);
    }
  }, [zones, draw]);

  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState('none')

  const [selectedFeature, setSelectedFeature] = useState();
  const [newFeature, setNewFeature] = useState()

  const [pendingDelete, setPendingDelete] = useState(false);

  const handleDelete = () => {
    setPendingDelete(true)
    try {
      if (mode === 'edit' && selectedFeature) {
        const { id } = selectedFeature;
        deleteFeature(id)
      }
    } catch (e) {
      console.log(e)
    }
    setTimeout(_ => setPendingDelete(false), 1000)
    setTimeout(_ => setMode('none'), 1500)
  }

  const fetchZones = async () => {
    try {
      const { data } = await ZoneService.getZones(role)
      const zones = data.body.docs
      setZones(zones);
    } catch (e) {
      if (e.response && e.response.data) {
        console.log(e.response.data.message)
      }
    } finally { }
  }

  useEffect(() => {
    if (map.current) return;
    fetchZones()
    map.current = createMap({
      container: mapContainer.current,
      center: [46.663077, 24.727627],
      zoom: 10
    })
    let position = i18n.dir() === 'rtl' ? "top-left" : "top-right"
    map.current.addControl(draw, position);
    map.current.addControl(mapControls.navigationControl(), position);
    map.current.addControl(mapControls.geolocationControl(), position);
    // map.current.setPadding({ left: 300, top: 50 });
  });

  const deleteFeature = async (id) => {
    try {
      if (mode === "edit") {
        const response = await ZoneService.deleteZone(role, id);
        console.log(response);
        setMode("none")
        setSelectedFeature();
      }
      draw.delete(id);
    } catch (e) {
      console.log(e)
    }
  }

  const [selectionChangeEvent, setSelectionChangeEvent] = useState();

  useEffect(_ => {
    if (!selectionChangeEvent) return
    handleSelectionChange(selectionChangeEvent);
  }, [selectionChangeEvent])

  const handleSelectionChange = useCallback(e => {
    if (isEmpty(e.features)) {
      if (selectedFeature) handleDismiss()
      if (newFeature) handleDiscard()
    } else {
      const feature = head(e.features);
      if (has(feature.properties, 'name')) {
        setMode('edit');
        setSelectedFeature(feature);
        handleDiscard(true)
      } else {
        setMode('add');
        setNewFeature(feature);
      }
    }
  }, [mode, selectedFeature])

  useEffect(() => {
    if (!map.current) return;

    map.current.on('draw.create', (e) => {
      const feature = head(e.features);
      setNewFeature(feature);
      setMode('add');
    });

    map.current.on('draw.update', (e) => {
      if (e.action === "change_coordinates" || e.action === "move") {
        const { id, geometry } = head(e.features);
        handleUpdateGeometry(id, geometry);
      }
    });

    map.current.on('draw.selectionchange', (e) => {
      setSelectionChangeEvent(e);
    });

    // map.current.on('draw.delete', e => {
    //   console.log(e);
    // });
    // map.current.on('draw.modechange', (e) => {
    //   console.log(e);
    // });
  }, [map]);

  const handleUpdateGeometry = async (id, geometry) => {
    try {
      ZoneService.updateZone(role, id, { geometry })
    } catch (e) {
      if (e.response && e.response.data) {
        setError(e.response.data.message)
      }
    } finally {
      setPendingSubmit(false)
    }
  }

  const handleSubmit = async (details) => {
    if (mode === 'add' && newFeature) {
      const feature = pick(newFeature, ['geometry', 'properties', 'type'])
      feature.properties = { ...details }
      // call API
      setPendingSubmit(true)
      setError("")
      try {
        await ZoneService.createZone(role, feature)
        draw.delete(newFeature.id)
        await fetchZones();
        setMode('none')
        setNewFeature();
      } catch (e) {
        if (e.response && e.response.data) {
          setError(e.response.data.message)
        }
      } finally {
        setPendingSubmit(false)
      }
    }
    if (mode === 'edit' && selectedFeature) {
      const properties = { ...details }
      // call API
      setPendingSubmit(true)
      setError("")
      try {
        await ZoneService.updateZone(role, selectedFeature.id, { properties })
        await fetchZones();
        // const feature = pick(data.body, ["geometry", "id", "properties", "type"])
      } catch (e) {
        if (e.response && e.response.data) {
          setError(e.response.data.message)
        }
      } finally {
        setPendingSubmit(false)
      }
    }
  }

  const handleDismiss = _ => {
    try {
      draw.changeMode("simple_select");
      setSelectedFeature();
      setMode('none')
    } catch (e) {
      console.log(e)
    }
  }

  const handleDiscard = shouldKeepMode => {
    if (!newFeature) return
    try {
      draw.delete(newFeature.id);
      setNewFeature();
      if (shouldKeepMode) return;
      setMode('none')
    } catch (e) {
      console.log(e)
    }
  }

  const zoneDetails = useMemo(_ => {
    if (mode === "none") return {}
    if (mode === "edit") return Boolean(selectedFeature) ? selectedFeature.properties : {}
    if (mode === "add") return Boolean(newFeature) ? newFeature.properties : {}
  }, [mode, selectedFeature, newFeature])

  const zoneDetailsVisible = useMemo(_ => {
    return Boolean(selectedFeature) || Boolean(newFeature)
  }, [mode, selectedFeature, newFeature])

  return (
    <>
      <Helmet>
        <title>Zones | {$APP_NAME}</title>
      </Helmet>
      <Box
        ref={mapContainer}
        sx={{
          bgcolor: "background.default",
          minHeight: "100%",
        }}
      >
        <ZoneDetails
          type={mode}
          visible={zoneDetailsVisible}
          details={zoneDetails}
          handleSubmit={handleSubmit}
          handleDismiss={handleDismiss}
          pendingSubmit={pendingSubmit}
          handleDelete={handleDelete}
          pendingDelete={pendingDelete}
          handleDiscard={handleDiscard}
          error={error}
        />
      </Box>
    </>
  )
};

export default ZoneList;
