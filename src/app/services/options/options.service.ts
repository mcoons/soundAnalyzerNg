
import { Injectable, Inject, ɵɵpipeBind1 } from '@angular/core';
import { Subscription, Observable, fromEvent, ObjectUnsubscribedError } from 'rxjs';

import { MessageService } from '../message/message.service';
import { StorageService } from '../storage/storage.service';
// import { EngineService } from '../../services/engine/engine.service';

// import { Single } from '../../visualization-classes/SingleSPS';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'prod'; // dev or prod

  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  public visuals = [
    'singleSPSCube',
    // 'singleSPSRibbon',
    'starManager',
    'spectrograph',
    'spherePlaneManagerSPS',
    'spherePlaneManager2SPS',
    'rings',
    'hex',
    'notes',
  ];

  CubeSPSs =
    [
      'blockPlane',
      'thing1',
      'blockSpiral',
      'thing2',
      'equation',
      'thing3',
      'cube',
      'sphere',
      'pole',
      'heart',
      // 'sineLoop',
      'sineLoop2'
    ];

  // RibbonSPSs =
  //   [
  //     'blockPlaneRibbon',
  //     'thing1Ribbon',
  //     'blockSpiralRibbon',
  //     'thing2Ribbon',
  //     'equationRibbon',
  //     'thing3Ribbon',
  //     'cubeRibbon',
  //     'sphereRibbon',
  //     'poleRibbon',
  //     'heartRibbon',
  //     'sineLoopRibbon'
  //   ];

  notes = [
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',  'None'
  ];


  ///////////////////////////////////////////////
  // NEW BASE OPTIONS

  /*

  An array of objects to render using the array keyname as group dropdown accordian name
  Objects will have type, label and value   possibly additional meta data for input
  Object may have other internal Metadata


  -- Components --

  User Options
    General Options
      Note
    Visual Effects
      Custom Colors
        Color



  Dev Options
    Light Options
      Light

    Visual Selection


  */

  // an array of objects to render using the array keyname as group dropdown name
  newBaseOptions = {
    version: 'b_1.0',

    currentVisual: 0,

    // an array of objects to render using the array keyname as group dropdown name
    general: {
      // general options
      showTitle: true,
      showWaveform: false,
      showSoundWave: false,

      showBars:
      {
        value: false,

        currentNote: 12,   //  Internal only - no display

        // key highlight options
        // an array of objects to render using the array keyname as group dropdown name
        note: [
          // A:
          {
            label: 'A',
            value: 82,
            checked: false,

            hertz: 55,
          },
          // 'A#':
          {
            label: 'A#',
            value: 87,
            checked: false,

            hertz: 58.270,
          },
          // B:
          {
            label: 'B',
            value: 92,
            checked: false,

            hertz: 61.735,
          },

          // C:
          {
            label: 'C',
            value: 33,
            checked: false,

            hertz: 32.703,
          },
          // 'C#':
          {
            label: 'C#',
            value: 39,
            checked: false,

            hertz: 34.648,
          },
          // D:
          {
            label: 'D',
            value: 45,
            checked: false,

            hertz: 36.708,
          },
          // 'D#':
          {
            label: 'D#',
            value: 52,
            checked: false,

            hertz: 38.891,
          },
          // E:
          {
            label: 'E',
            value: 58,
            checked: false,

            hertz: 41.2035,
          },
          // F:
          {
            label: 'F',
            value: 65,
            checked: false,

            hertz: 43.654,
          },
          // 'F#':
          {
            label: 'F#',
            value: 69,
            checked: false,

            hertz: 46.249,
          },
          // G:
          {
            label: 'G',
            value: 73,
            checked: false,

            hertz: 48.999,
          },
          // 'G#':
          {
            label: 'G#',
            value: 77,
            checked: false,

            hertz: 51.913,
          },
          // None:
          {
            label: 'None',
            value: 0,
            checked: true,

            hertz: 0,
          }

        ],
      }

    },

    // an array of objects to render using the array keyname as group dropdown name
    visual: [
      // singleSPSCube:
      {
        // type: 'radio',
        label: 'Exploding Cube SPS',
        value: 0,
        checked: true,

        colorOptions: true,
        cameraOptions: true,
        calpha: 0.72,
        cbeta: 1.57,
        cradius: 1000,

        sampleGain: {
          // type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          // min: 1,
          // max: 10,
          // step: 1
        },
        smoothingConstant: {
          // type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          // min: 1,
          // max: 9.9,
          // step: .1
        },
        autoRotate: {
          // type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,
          cameraCustom: true
        },
        customColors: {
          // type: 'checkbox',
          label: 'Custom Colors',
          value: true
        },
        maxColor: {
          // type: 'color',
          label: 'Maximum Color',
          value: '#ff0000'
        },
        midColor: {
          // type: 'color',
          label: 'Middle Color',
          value: '#000000'
        },
        minColor: {
          // type: 'color',
          label: 'Minimum Color',
          value: '#0000ff'
        },
        midLoc: {
          // type: 'colorslider',
          label: 'Midpoint Value',
          value: 128,
          min: 20,
          max: 235,
          step: 5
        },
        lights: [  //  array of lights

          // front light      options.lights[0].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Front Intensity',
              value: 80,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            },
          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Left Intensity',
              value: 10,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Right Intensity',
              value: 5,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Top Intensity',
              value: 5,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              // type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              // min: -200,
              // max: 200,
              // step: 5
            },
            color: {
              // type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              // type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              // type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ],


        singleSPSDelay: {
          // type: 'slider',
          label: 'Change Delay (sec)',
          value: 10,
          // min: 5,
          // max: 60,
          // step: 5,
        },
        singleSPSExplosionSize: {
          // type: 'slider',
          label: 'Explosion Size',
          value: 0,
          // min: 0,
          // max: 150,
          // step: 10,
        },

        types: [

          // blockPlane:
          {
            // type: 'checkbox',
            label: 'Cube Block Plane',
            value: true,
          },
          // thing1:
          {
            // type: 'checkbox',
            label: 'Cube Thing 1',
            value: true,
          },
          // blockSpiral:
          {
            // type: 'checkbox',
            label: 'Cube Block Spiral',
            value: true,
          },
          // thing2:
          {
            // type: 'checkbox',
            label: 'Cube Thing 2',
            value: true,
          },
          // equation:
          {
            // type: 'checkbox',
            label: 'Cube Equation',
            value: true,
          },
          // thing3:
          {
            // type: 'checkbox',
            label: 'Cube Thing 3',
            value: true,
          },
          // cube:
          {
            // type: 'checkbox',
            label: 'Cube Cube',
            value: true,
          },
          // sphere:
          {
            // type: 'checkbox',
            label: 'Cube Sphere',
            value: true,
          },
          // pole:
          {
            // type: 'checkbox',
            label: 'Cube Pole',
            value: true,
          },
          // heart:
          {
            // type: 'checkbox',
            label: 'Cube Heart',
            value: true,
          },
          // sineLoop2:
          {
            // type: 'checkbox',
            label: 'Cube Sine Loop',
            value: true,
          }

        ]
      },
      // starManager:
      {
        type: 'radio',
        label: 'Stars',
        value: 1,
        checked: false,

        colorOptions: false,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .01,
        cradius: 1200,

        autoRotate: {
          type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },

        smoothingConstant: {
          type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          min: 1,
          max: 9.9,
          step: .1
        },

        customColors: {
          type: 'checkbox',
          label: 'Custom Colors',
          value: true,

          midLoc: {
            type: 'colorslider',
            label: 'Midpoint Value',
            value: 128,
            min: 20,
            max: 235,
            step: 5
          },

          color: [

            // maxColor:
            {
              type: 'color',
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              type: 'color',
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              type: 'color',
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {

            intensity: {
              type: 'slider',
              label: 'Front Intensity',
              value: 80,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            }

          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Left Intensity',
              value: 10,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Right Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Top Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ]
      },

      // spectrograph:
      {
        type: 'radio',
        label: 'Spectrograph',
        value: 2,
        checked: false,

        colorOptions: false,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .85,
        cradius: 1200,

        autoRotate: {
          type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },

        smoothingConstant: {
          type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          min: 1,
          max: 9.9,
          step: .1
        },

        customColors: {
          type: 'checkbox',
          label: 'Custom Colors',
          value: true,

          midLoc: {
            type: 'colorslider',
            label: 'Midpoint Value',
            value: 128,
            min: 20,
            max: 235,
            step: 5
          },

          color: [

            // maxColor:
            {
              type: 'color',
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              type: 'color',
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              type: 'color',
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {

            intensity: {
              type: 'slider',
              label: 'Front Intensity',
              value: 80,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            }

          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Left Intensity',
              value: 10,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Right Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Top Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ]
      },

      // spherePlaneManagerSPS:
      {
        type: 'radio',
        label: 'Sphere Plane',
        value: 3,
        checked: false,

        colorOptions: true,
        cameraOptions: true,

        calpha: 4.72,
        cbeta: .81,
        cradius: 1200,

        autoRotate: {
          type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },

        smoothingConstant: {
          type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          min: 1,
          max: 9.9,
          step: .1
        },

        customColors: {
          type: 'checkbox',
          label: 'Custom Colors',
          value: true,

          midLoc: {
            type: 'colorslider',
            label: 'Midpoint Value',
            value: 128,
            min: 20,
            max: 235,
            step: 5
          },

          color: [

            // maxColor:
            {
              type: 'color',
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              type: 'color',
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              type: 'color',
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {

            intensity: {
              type: 'slider',
              label: 'Front Intensity',
              value: 80,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            }

          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Left Intensity',
              value: 10,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Right Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Top Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ]
      },

      // spherePlaneManager2SPS:
      {
        type: 'radio',
        label: 'Sphere Plane 2',
        value: 4,
        checked: false,

        colorOptions: true,
        cameraOptions: true,

        calpha: 4.72,
        cbeta: .01,
        cradius: 3200,

        autoRotate: {
          type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },

        smoothingConstant: {
          type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          min: 1,
          max: 9.9,
          step: .1
        },

        customColors: {
          type: 'checkbox',
          label: 'Custom Colors',
          value: true,

          midLoc: {
            type: 'colorslider',
            label: 'Midpoint Value',
            value: 128,
            min: 20,
            max: 235,
            step: 5
          },

          color: [

            // maxColor:
            {
              type: 'color',
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              type: 'color',
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              type: 'color',
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {

            intensity: {
              type: 'slider',
              label: 'Front Intensity',
              value: 80,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            }

          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Left Intensity',
              value: 10,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Right Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Top Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ]
      },

      // rings:
      {
        type: 'radio',
        label: 'Rings',
        value: 5,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .81,
        cradius: 1200,

        autoRotate: {
          type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },

        smoothingConstant: {
          type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          min: 1,
          max: 9.9,
          step: .1
        },

        customColors: {
          type: 'checkbox',
          label: 'Custom Colors',
          value: true,

          midLoc: {
            type: 'colorslider',
            label: 'Midpoint Value',
            value: 128,
            min: 20,
            max: 235,
            step: 5
          },

          color: [

            // maxColor:
            {
              type: 'color',
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              type: 'color',
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              type: 'color',
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {

            intensity: {
              type: 'slider',
              label: 'Front Intensity',
              value: 80,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            }

          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Left Intensity',
              value: 10,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Right Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Top Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ]
      },

      // hex:
      {
        type: 'radio',
        label: 'Hex',
        value: 6,
        checked: false,

        colorOptions: true,
        cameraOptions: true,

        calpha: 4.72,
        cbeta: .91,
        cradius: 1200,

        autoRotate: {
          type: 'checkbox',
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          type: 'slider',
          label: 'Visual Effect Strength',
          value: 1,
          min: 1,
          max: 10,
          step: 1,
        },

        smoothingConstant: {
          type: 'slider',
          label: 'Smoothing Constant',
          value: 8,
          min: 1,
          max: 9.9,
          step: .1
        },

        customColors: {
          type: 'checkbox',
          label: 'Custom Colors',
          value: true,

          midLoc: {
            type: 'colorslider',
            label: 'Midpoint Value',
            value: 128,
            min: 20,
            max: 235,
            step: 5
          },

          color: [

            // maxColor:
            {
              type: 'color',
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              type: 'color',
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              type: 'color',
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {

            intensity: {
              type: 'slider',
              label: 'Front Intensity',
              value: 80,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Light 0 Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Light 0 Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Light 0 Back Color',
              value: '#454545'
            }

          },

          // rear light       options.lights[1].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Rear Intensity',
              value: 30,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Rear Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Rear Back Color',
              value: '#454545'
            },
          },

          // left light       options.lights[2].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Left Intensity',
              value: 10,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Left Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Left Back Color',
              value: '#454545'
            },
          },

          // right light      options.lights[3].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Right Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Right Back Color',
              value: '#454545'
            },
          },

          // top light        options.lights[4].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Top Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Top Back Color',
              value: '#454545'
            },
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Bottom Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Bottom Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Bottom Back Color',
              value: '#454545'
            },
          },

          // camera light     options.lights[6].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Back Color',
              value: '#454545'
            },
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: {
              type: 'slider',
              label: 'Camera Rimlight Intensity',
              value: 5,
              min: -200,
              max: 200,
              step: 5
            },
            color: {
              type: 'color',
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              type: 'color',
              label: 'Camera Rimlight Specular',
              value: '#454545'
            },
            groundColor: {
              type: 'color',
              label: 'Camera Rimlight Back Color',
              value: '#454545'
            },
          }

        ]
      }

    ],

  };


  newBaseOptionsSave = {
    version: 'b_1.0',

    // an array of objects to render using the array keyname as group dropdown name
    general: [
      // general options
      // showTitle:
      {
        type: 'checkbox',
        label: 'Show Title',
        value: true,
      },
      // showBars:
      {
        type: 'checkbox',
        label: 'Show Freq Bars',
        value: false,

        currentNote: 'None',   //  Internal only - no display

        // key highlight options
        // an array of objects to render using the array keyname as group dropdown name
        notes: [

          // C:
          {
            type: 'numeric',
            label: 'C',
            value: 33,
            checked: false,

            hertz: 32.703,
          },
          // 'C#':
          {
            type: 'numeric',
            label: 'C#',
            value: 39,
            checked: false,

            hertz: 34.648,
          },
          // D:
          {
            type: 'numeric',
            label: 'D',
            value: 45,
            checked: false,

            hertz: 36.708,
          },
          // 'D#':
          {
            type: 'numeric',
            label: 'D#',
            value: 52,
            checked: false,

            hertz: 38.891,
          },
          // E:
          {
            type: 'numeric',
            label: 'E',
            value: 58,
            checked: false,

            hertz: 41.2035,
          },
          // F:
          {
            type: 'numeric',
            label: 'F',
            value: 65,
            checked: false,

            hertz: 43.654,
          },
          // 'F#':
          {
            type: 'numeric',
            label: 'F#',
            value: 69,
            checked: false,

            hertz: 46.249,
          },
          // G:
          {
            type: 'numeric',
            label: 'G',
            value: 73,
            checked: false,

            hertz: 48.999,
          },
          // 'G#':
          {
            type: 'numeric',
            label: 'G#',
            value: 77,
            checked: false,

            hertz: 51.913,
          },
          // A:
          {
            type: 'numeric',
            label: 'A',
            value: 82,
            checked: false,

            hertz: 55,
          },
          // 'A#':
          {
            type: 'numeric',
            label: 'A#',
            value: 87,
            checked: false,

            hertz: 58.270,
          },
          // B:
          {
            type: 'numeric',
            label: 'B',
            value: 92,
            checked: false,

            hertz: 61.735,
          },
          // None:
          {
            type: 'numeric',
            label: 'None',
            value: 0,
            checked: true,

            hertz: 0,
          },
        ],
      },
      // showWaveform:
      {
        type: 'checkbox',
        label: 'Show Waveform',
        value: false
      },

    ],

    // an array of objects to render using the array keyname as group dropdown name
    visual: [
      // starManager:
      {
        value: 1,
        checked: false,

        colorOptions: false,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .01,
        cradius: 1200,

        customColors: {
          value: true,

          color: [
            // maxColor:
            { value: '#ff0000' },
            // midColor:
            { value: '#000000' },
            // minColor:
            { value: '#0000ff' },
            // midLoc:
            { value: 128 }
          ],
        },

        audio: [
          // sampleGain:
          { value: 1 },
          // smoothingConstant:
          { value: 8 }
        ],

        autoRotate: {
          value: true,

          cameraCustom: true
        },

        light: [  //  array of lights

          // front light      options.lights[0].attribute
          {
            intensity: { value: 80 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // rear light       options.lights[1].attribute
          {
            intensity: { value: 30 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // left light       options.lights[2].attribute
          {
            intensity: { value: 10 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // right light      options.lights[3].attribute
          {
            intensity: { value: 5 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // top light        options.lights[4].attribute
          {
            intensity: { value: 5 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // bottom light     options.lights[5].attribute
          {
            intensity: { value: 5 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // camera light     options.lights[6].attribute
          {
            intensity: { value: 5 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          },

          // camera rimlight  options.lights[7].attribute
          {
            intensity: { value: 5 },
            color: { value: '#ffffff' },
            specular: { value: '#454545' },
            groundColor: { value: '#454545' }
          }
        ]
      }
    ]
  };


  public favorites = [];


  ///////////////////////////////////////////////
  // ORIGINAL BASE OPTIONS
  baseOptions = {

    version: 3.88,

    // general options
    showTitle: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Title',
      value: true,
    },
    showBars: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Freq Bars',
      value: false
    },
    showWaveform: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Waveform',
      value: false
    },
    waveformMultiplier: {
      group: 'General',
      type: 'waveslider',
      label: 'Waveform Multiplier',
      value: 1,
      min: 1,
      max: 10,
      step: .1
    },



    // front light
    light0Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Front Intensity',
      value: 80,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light0Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light0Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light0GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },

    // rear light
    light1Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Rear Intensity',
      value: 30,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light1Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light1Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light1GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },

    // left light
    light2Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Left Intensity',
      value: 10,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light2Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light2Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },

    light2GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },

    // right light
    light3Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Right Intensity',
      value: 5,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light3Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light3Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light3GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },

    // top light
    light4Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Top Intensity',
      value: 5,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light4Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light4Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light4GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },



    // bottom light
    light5Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Bottom Intensity',
      value: 5,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light5Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light5Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light5GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },


    // camera light
    light6Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Camera Intensity',
      value: 5,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light6Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light6Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light6GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },



    // camera rimlight
    light7Intensity: {
      group: 'Scene',
      type: 'slider',
      label: 'Camera Rimlight Intensity',
      value: 5,
      min: -200,
      max: 200,
      step: 5,
      visualCustom: true
    },
    light7Color: {
      group: 'Scene',
      type: 'color',
      label: 'Color',
      value: '#ffffff',
      visualCustom: true
    },
    light7Specular: {
      group: 'Scene',
      type: 'color',
      label: 'Specular',
      value: '#454545',
      visualCustom: true
    },
    light7GroundColor: {
      group: 'Scene',
      type: 'color',
      label: 'Back Color',
      value: '#454545',
      visualCustom: true
    },










    starManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 1,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .01,
      cradius: 1200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },
    spectrograph: {
      group: '3DVisual',
      type: 'radio',
      label: 'Spectrograph',
      value: 2,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .85,
      cradius: 1200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },

    spherePlaneManagerSPS: {
      group: '3DVisual',
      type: 'radio',
      label: 'Sphere Plane',
      value: 3,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: true,
      customColors: false,
      minColor: '#ff0000',
      midColor: '#2b00ff',
      maxColor: '#42fffc',
      midLoc: 145,
      calpha: 4.72,
      cbeta: .81,
      cradius: 1200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },

    spherePlaneManager2SPS: {
      group: '3DVisual',
      type: 'radio',
      label: 'Sphere Plane 2',
      value: 4,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: false,
      customColors: false,
      minColor: '#000000',
      midColor: '#2760aa',
      maxColor: '#ff0505',
      midLoc: 110,
      calpha: 4.72,
      cbeta: .01,
      cradius: 3200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },



    rings: {
      group: '3DVisual',
      type: 'radio',
      label: 'Rings',
      value: 5,
      checked: false,
      colorOptions: true,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .81,
      cradius: 1200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },
    hex: {
      group: '3DVisual',
      type: 'radio',
      label: 'Hex',
      value: 6,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .91,
      cradius: 1200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },
    notes: {
      group: '3DVisual',
      type: 'radio',
      label: 'Notes',
      value: 7,
      checked: false,
      colorOptions: true,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: false,
      customColors: true,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .85,
      cradius: 1200,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },

    singleSPSCube: {
      group: '3DVisual',
      type: 'radio',
      label: 'Exploding Cube SPS',
      value: 0,
      checked: true,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 8,
      autoRotate: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 0.72,
      cbeta: 1.57,
      cradius: 1000,
      light0Intensity: 80,
      light0Color: '#ffffff',
      light0Specular: '#454545',
      light0GroundColor: '#454545',
      light1Intensity: 30,
      light1Color: '#ffffff',
      light1Specular: '#454545',
      light1GroundColor: '#454545',
      light2Intensity: 10,
      light2Color: '#ffffff',
      light2Specular: '#454545',
      light2GroundColor: '#454545',
      light3Intensity: 5,
      light3Color: '#ffffff',
      light3Specular: '#454545',
      light3GroundColor: '#454545',
      light4Intensity: 5,
      light4Color: '#ffffff',
      light4Specular: '#454545',
      light4GroundColor: '#454545',
      light5Intensity: 5,
      light5Color: '#ffffff',
      light5Specular: '#454545',
      light5GroundColor: '#454545',
      light6Intensity: 5,
      light6Color: '#ffffff',
      light6Specular: '#454545',
      light6GroundColor: '#454545',
      light7Intensity: 5,
      light7Color: '#ffffff',
      light7Specular: '#454545',
      light7GroundColor: '#454545',
    },

    singleSPSDelay: {
      group: '3DVisual',
      type: 'slider',
      label: 'Change Delay (sec)',
      value: 10,
      min: 5,
      max: 60,
      step: 5,
    },
    singleSPSExplosionSize: {
      group: '3DVisual',
      type: 'slider',
      label: 'Explosion Size',
      value: 0,
      min: 0,
      max: 150,
      step: 10,
    },




    blockPlane: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Block Plane',
      value: true,
    },
    thing1: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Thing 1',
      value: true,
    },
    blockSpiral: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Block Spiral',
      value: true,
    },
    thing2: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Thing 2',
      value: true,
    },
    equation: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Equation',
      value: true,
    },
    thing3: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Thing 3',
      value: true,
    },
    cube: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Cube',
      value: true,
    },
    sphere: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Sphere',
      value: true,
    },
    pole: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Pole',
      value: true,
    },

    heart: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Heart',
      value: true,
    },

    // sineLoop: {
    //   group: 'CubeSPS',
    //   type: 'checkbox',
    //   label: 'Cube Sine Loop',
    //   value: true,
    // },


    sineLoop2: {
      group: 'CubeSPS',
      type: 'checkbox',
      label: 'Cube Sine Loop',
      value: true,
    },



    sampleGain: {
      group: 'VisualEffect',
      type: 'slider',
      label: 'Visual Effect Strength',
      value: 1,
      min: 1,
      max: 10,
      step: 1,
      visualCustom: true
    },
    smoothingConstant: {
      group: 'VisualEffect',
      type: 'slider',
      label: 'Smoothing Constant',
      value: 8,
      min: 1,
      max: 9.9,
      step: .1,
      visualCustom: true
    },
    autoRotate: {
      group: 'VisualEffect',
      type: 'checkbox',
      label: 'Auto Rotate',
      value: true,
      cameraCustom: true
    },

    customColors: {
      group: 'VisualEffect',
      type: 'checkbox',
      label: 'Custom Colors',
      value: true,
      visualCustom: true
    },
    maxColor: {
      group: 'VisualEffect',
      type: 'color',
      label: 'Maximum Color',
      value: '#ff0000',
      visualCustom: true
    },
    midColor: {
      group: 'VisualEffect',
      type: 'color',
      label: 'Middle Color',
      value: '#000000',
      visualCustom: true
    },
    minColor: {
      group: 'VisualEffect',
      type: 'color',
      label: 'Minimum Color',
      value: '#0000ff',
      visualCustom: true
    },
    midLoc: {
      group: 'VisualEffect',
      type: 'colorslider',
      label: 'Midpoint Value',
      value: 128,
      min: 20,
      max: 235,
      step: 5,
      visualCustom: true
    },



    // singleSPSRibbon: {
    //   group: '3DVisual',
    //   type: 'radio',
    //   label: 'Exploding Ribbon SPS',
    //   value: 1,
    //   checked: true,
    //   colorOptions: true,
    //   cameraOptions: true,
    //   sampleGain: 1,
    //   smoothingConstant: 8,
    //   autoRotate: true,
    //   customColors: false,
    //   minColor: '#0000ff',
    //   midColor: '#00ff00',
    //   maxColor: '#ff0000',
    //   midLoc: 128,
    //   calpha: 4.72,
    //   cbeta: 1.57,
    //   cradius: 1000,
    //   light0Intensity: 80,
    //   light0Color: '#ffffff',
    //   light0Specular: '#454545',
    //   light1Intensity: 30,
    //   light1Color: '#ffffff',
    //   light1Specular: '#454545',
    //   light2Intensity: 10,
    //   light2Color: '#ffffff',
    //   light2Specular: '#454545',
    //   light3Intensity: 5,
    //   light3Color: '#ffffff',
    //   light3Specular: '#454545',
    // },

    // blockPlaneRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Block Plane',
    //   value: true,
    // },
    // thing1Ribbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Thing 1',
    //   value: true,
    // },
    // blockSpiralRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Block Spiral',
    //   value: true,
    // },
    // thing2Ribbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Thing 2',
    //   value: true,
    // },
    // equationRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Equation',
    //   value: true,
    // },
    // thing3Ribbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Thing 3',
    //   value: true,
    // },
    // cubeRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Cube',
    //   value: true,
    // },
    // sphereRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Sphere',
    //   value: true,
    // },
    // poleRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Pole',
    //   value: true,
    // },

    // heartRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Heart',
    //   value: true,
    // },

    // sineLoopRibbon: {
    //   group: 'RibbonSPS',
    //   type: 'checkbox',
    //   label: 'Sine Loop',
    //   value: true,
    // },










    // key highlight options
    currentNote: {
      group: 'Hidden',
      type: 'string',
      label: 'currentNote',
      value: 'None'
    },
    None: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'None',
      hertz: 0,
      value: 0,
      checked: true
    },
    C: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'C',
      hertz: 32.703,
      value: 33,
      checked: false
    },
    'C#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'C#',
      hertz: 34.648,
      value: 39,
      checked: false
    },
    D: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'D',
      hertz: 36.708,
      value: 45,
      checked: false
    },
    'D#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'D#',
      hertz: 38.891,
      value: 52,
      checked: false
    },
    E: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'E',
      hertz: 41.2035,
      value: 58,
      checked: false
    },
    F: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'F',
      hertz: 43.654,
      value: 65,
      checked: false
    },
    'F#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'F#',
      hertz: 46.249,
      value: 69,
      checked: false
    },
    G: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'G',
      hertz: 48.999,
      value: 73,
      checked: false
    },
    'G#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'G#',
      hertz: 51.913,
      value: 77,
      checked: false
    },
    A: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'A',
      hertz: 55,
      value: 82,
      checked: false
    },
    'A#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'A#',
      hertz: 58.270,
      value: 87,
      checked: false
    },
    B: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'B',
      hertz: 61.735,
      value: 92,
      checked: false
    },

  };


  ///////////////////////////////////////////////


  options = JSON.parse(JSON.stringify(this.baseOptions));

  public state = {
    showPanel: { value: false },
    showFavorites: { value: false },
    showPlayer: { value: false },
    showSplash: { value: true },
    currentVisual: { value: 0 },
    windowHeight: { value: 0 },
    playerHeight: { value: 0 },
    pixelRatio: { value: 0 },
    playerTopHTML: { value: 0 },
    playerTopCanvas: { value: 0 },
    playlist: { value: [] },
    currentTrack: { value: 0 },
    playing: { value: false },
    microphone: { value: false },
    renderPlayer: { value: false },
    showTrackTitle: { value: true },
    input: { value: 'site' },

    volume: {
      group: 'Hidden',
      type: 'slider',
      label: 'Volume',
      min: 0,
      max: 10,
      step: 1,
      value: 5
    }
  };

  constructor(
    @Inject(MessageService) public messageService: MessageService,
    @Inject(StorageService) public storageService: StorageService,
    // @Inject(EngineService) private engineService: EngineService

  ) {
    console.log('Options Service Constructor');
    console.log('Options from start');
    console.log(this.options);

    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      this.windowResize();
    });

    // this.SPSs = this.getSPSNames();

    const lOptions = storageService.loadOptions();
    if (lOptions.version) {
      if (lOptions.version !== this.baseOptions.version) {
        storageService.deleteOptions();
        alert('Options have changed.  Clearing saved settings.');
      } else {
        // load user options
        for (const [key, value] of Object.entries(lOptions)) {
          if (key in this.baseOptions) {
            // console.log(`${key}: ${value}`);
            if (typeof value === 'object' && value !== null) {

              for (const [ikey, ivalue] of Object.entries(value)) {
                this.options[key][ikey] = ivalue;
              }

            } else {
              this.options[key] = value;
            }
          }
        }
        this.updateCustomOptions(this.state.currentVisual.value);
      }
    } else {
      console.log('local options error');
    }

    console.log('Options');
    console.log(this.options);
  }

  setOptionNew(itemName: string, value) {
    this.options[itemName].value = value;
    // this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + value);
    this.storageService.saveOptions(this.options);
  }


  toggleNoteRadioNew(itemName: string, index: number) {
    console.log('itemName: ', itemName);
    console.log('index: ', index);
    this.notes.forEach((n, i) => {
      this.newBaseOptions.general.showBars.note[i].checked = (itemName === n);
    });
    this.newBaseOptions.general.showBars.currentNote = index;
    console.log(this.newBaseOptions.general.showBars.currentNote);
    console.log(this.newBaseOptions);
;    // TO DO:
    // this.storageService.saveOptions(this.options); 
  }






















  toggleOption(itemName: string) {
    this.options[itemName].value = !this.options[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
    this.storageService.saveOptions(this.options);
  }

  toggleState(itemName: string) {
    this.state[itemName].value = !this.state[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.state[itemName].value);
    // this.storageService.saveOptions(this.options);
  }

  toggleVisualRadio(itemName: string, index: number) {

    this.visuals.forEach(v => {
      this.options[v].checked = (itemName === v);
    });

    this.updateCustomOptions(index);

    this.storageService.saveOptions(this.options);
  }

  updateCustomOptions(visualIndex) {

    this.options.smoothingConstant.value = this.options[this.visuals[visualIndex]].smoothingConstant;
    this.options.sampleGain.value = this.options[this.visuals[visualIndex]].sampleGain;
    this.options.autoRotate.value = this.options[this.visuals[visualIndex]].autoRotate;
    this.options.customColors.value = this.options[this.visuals[visualIndex]].customColors;
    this.options.minColor.value = this.options[this.visuals[visualIndex]].minColor;
    this.options.midColor.value = this.options[this.visuals[visualIndex]].midColor;
    this.options.maxColor.value = this.options[this.visuals[visualIndex]].maxColor;
    this.options.midLoc.value = this.options[this.visuals[visualIndex]].midLoc;

    this.options.light0Intensity.value = this.options[this.visuals[visualIndex]].light0Intensity;
    this.options.light0Color.value = this.options[this.visuals[visualIndex]].light0Color;
    this.options.light0Specular.value = this.options[this.visuals[visualIndex]].light0Specular;
    this.options.light0GroundColor.value = this.options[this.visuals[visualIndex]].light0GroundColor;
    this.options.light1Intensity.value = this.options[this.visuals[visualIndex]].light1Intensity;
    this.options.light1Color.value = this.options[this.visuals[visualIndex]].light1Color;
    this.options.light1Specular.value = this.options[this.visuals[visualIndex]].light1Specular;
    this.options.light1GroundColor.value = this.options[this.visuals[visualIndex]].light1GroundColor;
    this.options.light2Intensity.value = this.options[this.visuals[visualIndex]].light2Intensity;
    this.options.light2Color.value = this.options[this.visuals[visualIndex]].light2Color;
    this.options.light2Specular.value = this.options[this.visuals[visualIndex]].light2Specular;
    this.options.light2GroundColor.value = this.options[this.visuals[visualIndex]].light2GroundColor;
    this.options.light3Intensity.value = this.options[this.visuals[visualIndex]].light3Intensity;
    this.options.light3Color.value = this.options[this.visuals[visualIndex]].light3Color;
    this.options.light3Specular.value = this.options[this.visuals[visualIndex]].light3Specular;
    this.options.light3GroundColor.value = this.options[this.visuals[visualIndex]].light3GroundColor;

    this.options.light4Intensity.value = this.options[this.visuals[visualIndex]].light4Intensity;
    this.options.light4Color.value = this.options[this.visuals[visualIndex]].light4Color;
    this.options.light4Specular.value = this.options[this.visuals[visualIndex]].light4Specular;
    this.options.light4GroundColor.value = this.options[this.visuals[visualIndex]].light4GroundColor;
    this.options.light5Intensity.value = this.options[this.visuals[visualIndex]].light5Intensity;
    this.options.light5Color.value = this.options[this.visuals[visualIndex]].light5Color;
    this.options.light5Specular.value = this.options[this.visuals[visualIndex]].light5Specular;
    this.options.light5GroundColor.value = this.options[this.visuals[visualIndex]].light5GroundColor;
    this.options.light6Intensity.value = this.options[this.visuals[visualIndex]].light6Intensity;
    this.options.light6Color.value = this.options[this.visuals[visualIndex]].light6Color;
    this.options.light6Specular.value = this.options[this.visuals[visualIndex]].light6Specular;
    this.options.light6GroundColor.value = this.options[this.visuals[visualIndex]].light6GroundColor;
    this.options.light7Intensity.value = this.options[this.visuals[visualIndex]].light7Intensity;
    this.options.light7Color.value = this.options[this.visuals[visualIndex]].light7Color;
    this.options.light7Specular.value = this.options[this.visuals[visualIndex]].light7Specular;
    this.options.light7GroundColor.value = this.options[this.visuals[visualIndex]].light7GroundColor;


    this.messageService.announceMessage('set lights');

    this.announceChange('smoothingConstant');
    this.announceChange('sampleGain');

    console.log(this.options);

  }

  /*

      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 2,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 1,         ++
      smoothingConstant: 8,  ++
      autoRotate: false,     ++
      customColors: false,   ++
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .01,
      cradius: 1200,
      light0Intensity: 1,
      light0Color: '#ffffff',
      light0Specular: '#ffffff',
      light1Intensity: 1,
      light1Color: '#ffffff',
      light1Specular: '#ffffff',
      light2Intensity: 1,
      light2Color: '#ffffff',
      light2Specular: '#ffffff',
      light3Intensity: 1,
      light3Color: '#ffffff',
      light3Specular: '#ffffff',

  */

  toggleNoteRadio(itemName: string, index: number) {
    this.notes.forEach(n => {
      this.options[n].checked = (itemName === n);
    });
    this.storageService.saveOptions(this.options);
  }



  setOption(itemName: string, value) {
    this.options[itemName].value = value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
    this.storageService.saveOptions(this.options);
  }

  getOptions() {
    return this.options;
  }

  getOption(option) {
    return this.options[option].value;
  }

  updateState(itemName: string, value) {
    this.state[itemName].value = value;
    this.announceChange('State was changed: ' + itemName + ' to ' + this.state[itemName].value);
  }

  getState() {
    return this.state;
  }

  announceChange(message: string) {
    this.messageService.announceMessage(message);
  }

  windowResize() {
    const playerDiv = document.getElementById('playerDiv') as HTMLElement;
    if (playerDiv == null) {
      return;
    }

    this.updateState('windowHeight', window.outerHeight);
    this.updateState('playerHeight', playerDiv.clientHeight);
    this.updateState('pixelRatio', window.devicePixelRatio);
    this.updateState('playerTopHTML', playerDiv.offsetTop);
    this.updateState('playerTopCanvas', playerDiv.offsetTop * window.devicePixelRatio);
  }

  public getSelectedCubeSPSCount() {
    let count = 0;
    for (let index = 0; index < this.CubeSPSs.length; index++) {
      count += (this.options[this.CubeSPSs[index]].value ? 1 : 0);
    }
    return count;
  }

  // public getSelectedRibbonSPSCount() {
  //   let count = 0;
  //   for (let index = 0; index < this.RibbonSPSs.length; index++) {
  //     count += (this.options[this.RibbonSPSs[index]].value ? 1 : 0);
  //   }
  //   return count;
  // }

  get showTitle(): boolean {
    return this.options.showTitle.value;
  }

  set showTitle(value: boolean) {
    this.options.showTitle.value = value;
    this.storageService.saveOptions(this.options);
  }

  get showWaveform() {
    return this.options.showWaveform.value;
  }

  set showWaveform(value) {
    this.options.showWaveform.value = value;
    this.storageService.saveOptions(this.options);
  }




  get light0Intensity(): number {
    return this.options.light0Intensity.value;
  }

  set light0Intensity(value: number) {
    this.options.light0Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light0Intensity = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light0Color(): string {
    return this.options.light0Color.value;
  }

  set light0Color(value: string) {
    this.options.light0Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light0Color = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light0Specular() {
    return this.options.light0Specular.value;
  }

  set light0Specular(value: string) {
    this.options.light0Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light0Specular = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }


  get light0GroundColor() {
    return this.options.light0GroundColor.value;
  }

  set light0GroundColor(value: string) {
    this.options.light0GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light0GroundColor = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }



  get light1Intensity(): number {
    return this.options.light1Intensity.value;
  }

  set light1Intensity(value: number) {
    this.options.light1Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light1Intensity = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light1Color() {
    return this.options.light1Color.value;
  }

  set light1Color(value: string) {
    this.options.light1Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light1Color = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light1Specular() {
    return this.options.light1Specular.value;
  }

  set light1Specular(value: string) {
    this.options.light1Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light1Specular = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light1GroundColor() {
    return this.options.light1GroundColor.value;
  }

  set light1GroundColor(value: string) {
    this.options.light1GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light1GroundColor = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }


  get light2Intensity(): number {
    return this.options.light2Intensity.value;
  }

  set light2Intensity(value: number) {
    this.options.light2Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light2Intensity = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }


  get light2Color() {
    return this.options.light2Color.value;
  }

  set light2Color(value: string) {
    this.options.light2Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light2Color = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light2Specular() {
    return this.options.light2Specular.value;
  }

  set light2Specular(value: string) {
    this.options.light2Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light2Specular = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }

  get light2GroundColor() {
    return this.options.light2GroundColor.value;
  }

  set light2GroundColor(value: string) {
    this.options.light2GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light2GroundColor = value;

    this.storageService.saveOptions(this.options);
    // this.messageService.announceMessage('set lights');

  }



  get light3Intensity(): number {
    return this.options.light3Intensity.value;
  }

  set light3Intensity(value: number) {
    this.options.light3Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light3Intensity = value;
    this.storageService.saveOptions(this.options);
  }

  get light3Color() {
    return this.options.light3Color.value;
  }

  set light3Color(value: string) {
    this.options.light3Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light3Color = value;
    this.storageService.saveOptions(this.options);
  }

  get light3Specular() {
    return this.options.light3Specular.value;
  }

  set light3Specular(value: string) {
    this.options.light3Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light3Specular = value;
    this.storageService.saveOptions(this.options);
  }

  get light3GroundColor() {
    return this.options.light3GroundColor.value;
  }

  set light3GroundColor(value: string) {
    this.options.light3GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light3GroundColor = value;
    this.storageService.saveOptions(this.options);
  }



  get light4Intensity(): number {
    return this.options.light4Intensity.value;
  }

  set light4Intensity(value: number) {
    this.options.light4Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light4Intensity = value;
    this.storageService.saveOptions(this.options);
  }

  get light4Color() {
    return this.options.light4Color.value;
  }

  set light4Color(value: string) {
    this.options.light4Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light4Color = value;
    this.storageService.saveOptions(this.options);
  }

  get light4Specular() {
    return this.options.light4Specular.value;
  }

  set light4Specular(value: string) {
    this.options.light4Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light4Specular = value;
    this.storageService.saveOptions(this.options);
  }

  get light4GroundColor() {
    return this.options.light4GroundColor.value;
  }

  set light4GroundColor(value: string) {
    this.options.light4GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light4GroundColor = value;
    this.storageService.saveOptions(this.options);
  }




  get light5Intensity(): number {
    return this.options.light5Intensity.value;
  }

  set light5Intensity(value: number) {
    this.options.light5Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light5Intensity = value;
    this.storageService.saveOptions(this.options);
  }

  get light5Color() {
    return this.options.light5Color.value;
  }

  set light5Color(value: string) {
    this.options.light5Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light5Color = value;
    this.storageService.saveOptions(this.options);
  }

  get light5Specular() {
    return this.options.light5Specular.value;
  }

  set light5Specular(value: string) {
    this.options.light5Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light5Specular = value;
    this.storageService.saveOptions(this.options);
  }

  get light5GroundColor() {
    return this.options.light5GroundColor.value;
  }

  set light5GroundColor(value: string) {
    this.options.light5GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light5GroundColor = value;
    this.storageService.saveOptions(this.options);
  }




  get light6Intensity(): number {
    return this.options.light6Intensity.value;
  }

  set light6Intensity(value: number) {
    this.options.light6Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light6Intensity = value;
    this.storageService.saveOptions(this.options);
  }

  get light6Color() {
    return this.options.light6Color.value;
  }

  set light6Color(value: string) {
    this.options.light6Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light6Color = value;
    this.storageService.saveOptions(this.options);
  }

  get light6Specular() {
    return this.options.light6Specular.value;
  }

  set light6Specular(value: string) {
    this.options.light6Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light6Specular = value;
    this.storageService.saveOptions(this.options);
  }

  get light6GroundColor() {
    return this.options.light6GroundColor.value;
  }

  set light6GroundColor(value: string) {
    this.options.light6GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light6GroundColor = value;
    this.storageService.saveOptions(this.options);
  }



  get light7Intensity(): number {
    return this.options.light7Intensity.value;
  }

  set light7Intensity(value: number) {
    this.options.light7Intensity.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light7Intensity = value;
    this.storageService.saveOptions(this.options);
  }

  get light7Color() {
    return this.options.light7Color.value;
  }

  set light7Color(value: string) {
    this.options.light7Color.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light7Color = value;
    this.storageService.saveOptions(this.options);
  }

  get light7Specular() {
    return this.options.light7Specular.value;
  }

  set light7Specular(value: string) {
    this.options.light7Specular.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light7Specular = value;
    this.storageService.saveOptions(this.options);
  }

  get light7GroundColor() {
    return this.options.light7GroundColor.value;
  }

  set light7GroundColor(value: string) {
    this.options.light7GroundColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].light7GroundColor = value;
    this.storageService.saveOptions(this.options);
  }










  get waveformDelay(): number {
    return this.options.waveformDelay.value;
  }

  set waveformDelay(value: number) {
    this.options.waveformDelay.value = value;
    this.storageService.saveOptions(this.options);
  }

  get waveformMultiplier(): number {
    return this.options.waveformMultiplier.value;
  }

  set waveformMultiplier(value: number) {
    this.options.waveformMultiplier.value = value;
    this.storageService.saveOptions(this.options);
  }

  get showBars(): boolean {
    return this.options.showBars.value;
  }

  set showBars(value: boolean) {
    this.options.showBars.value = value;
    this.storageService.saveOptions(this.options);
  }

  get renderPlayer(): boolean {
    return this.state.renderPlayer.value;
  }

  set renderPlayer(value: boolean) {
    this.state.renderPlayer.value = value;
    this.storageService.saveOptions(this.options);
  }

  get showTrackTitle(): boolean {
    return this.state.showTrackTitle.value;
  }

  set showTrackTitle(value: boolean) {
    this.state.showTrackTitle.value = value;
    this.storageService.saveOptions(this.options);
  }

  get volume(): number {
    return this.state.volume.value;
  }

  set volume(value: number) {
    this.state.volume.value = value as number;
    this.storageService.saveOptions(this.options);
  }

  get sampleGain(): number {
    return this.options.sampleGain.value;
  }

  set sampleGain(value: number) {
    this.options.sampleGain.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].sampleGain = value;
    this.storageService.saveOptions(this.options);
  }

  get smoothingConstant(): number {
    return this.options.smoothingConstant.value;
  }

  set smoothingConstant(value: number) {
    this.options.smoothingConstant.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].smoothingConstant = value;
    this.storageService.saveOptions(this.options);
  }

  get singleSPSDelay(): number {
    return this.options.singleSPSDelay.value;
  }

  set singleSPSDelay(value: number) {
    this.options.singleSPSDelay.value = value;
    this.storageService.saveOptions(this.options);
  }


  get singleSPSExplosionSize(): number {
    return this.options.singleSPSExplosionSize.value;
  }

  set singleSPSExplosionSize(value: number) {
    this.options.singleSPSExplosionSize.value = value;
    this.storageService.saveOptions(this.options);
  }

  get blockPlane(): boolean {
    return this.options.blockPlane.value;
  }

  set blockPlane(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.blockPlane.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.blockPlane.value = !value;
      (document.getElementById('blockPlane') as HTMLInputElement).checked = true;
    }
  }

  get thing1(): boolean {
    return this.options.thing1.value;
  }

  set thing1(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.thing1.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.thing1.value = !value;
      (document.getElementById('thing1') as HTMLInputElement).checked = true;
    }
  }

  get blockSpiral(): boolean {
    return this.options.blockSpiral.value;
  }

  set blockSpiral(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.blockSpiral.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.blockSpiral.value = !value;
      (document.getElementById('blockSpiral') as HTMLInputElement).checked = true;
    }
  }

  get thing2(): boolean {
    return this.options.thing2.value;
  }

  set thing2(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.thing2.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.thing2.value = !value;
      (document.getElementById('thing2') as HTMLInputElement).checked = true;
    }
  }

  get equation(): boolean {
    return this.options.equation.value;
  }

  set equation(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.equation.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.equation.value = !value;
      (document.getElementById('equation') as HTMLInputElement).checked = true;
    }
  }


  get thing3(): boolean {
    return this.options.thing3.value;
  }

  set thing3(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.thing3.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.thing3.value = !value;
      (document.getElementById('thing3') as HTMLInputElement).checked = true;
    }
  }


  get cube(): boolean {
    return this.options.cube.value;
  }

  set cube(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.cube.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.cube.value = !value;
      (document.getElementById('cube') as HTMLInputElement).checked = true;
    }
  }

  get sphere(): boolean {
    return this.options.sphere.value;
  }

  set sphere(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.sphere.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.sphere.value = !value;
      (document.getElementById('sphere') as HTMLInputElement).checked = true;
    }
  }

  get pole(): boolean {
    return this.options.pole.value;
  }

  set pole(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.pole.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.pole.value = !value;
      (document.getElementById('pole') as HTMLInputElement).checked = true;
    }
  }

  get heart(): boolean {
    return this.options.heart.value;
  }

  set heart(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.heart.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.heart.value = !value;
      (document.getElementById('heart') as HTMLInputElement).checked = true;
    }
  }


  get sineLoop(): boolean {
    return this.options.sineLoop.value;
  }

  set sineLoop(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.sineLoop.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.sineLoop.value = !value;
      (document.getElementById('sineLoop') as HTMLInputElement).checked = true;
    }
  }



  get sineLoop2(): boolean {
    return this.options.sineLoop2.value;
  }

  set sineLoop2(value: boolean) {
    if ((!value && this.getSelectedCubeSPSCount() > 1) || value) {
      this.options.sineLoop2.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.sineLoop2.value = !value;
      (document.getElementById('sineLoop2') as HTMLInputElement).checked = true;
    }
  }


  ///////////////////////////////////////////////////////////////////////////
  //    RIBBON
  ///////////////////////////////////////////////////////////////////////////



  // get blockPlaneRibbon(): boolean {
  //   return this.options.blockPlaneRibbon.value;
  // }

  // set blockPlaneRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.blockPlaneRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.blockPlaneRibbon.value = !value;
  //     (document.getElementById('blockPlaneRibbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get thing1Ribbon(): boolean {
  //   return this.options.thing1Ribbon.value;
  // }

  // set thing1Ribbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.thing1Ribbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.thing1Ribbon.value = !value;
  //     (document.getElementById('thing1Ribbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get blockSpiralRibbon(): boolean {
  //   return this.options.blockSpiralRibbon.value;
  // }

  // set blockSpiralRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.blockSpiralRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.blockSpiralRibbon.value = !value;
  //     (document.getElementById('blockSpiralRibbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get thing2Ribbon(): boolean {
  //   return this.options.thing2Ribbon.value;
  // }

  // set thing2Ribbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.thing2Ribbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.thing2Ribbon.value = !value;
  //     (document.getElementById('thing2Ribbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get equationRibbon(): boolean {
  //   return this.options.equationRibbon.value;
  // }

  // set equationRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.equationRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.equationRibbon.value = !value;
  //     (document.getElementById('equationRibbon') as HTMLInputElement).checked = true;
  //   }
  // }


  // get thing3Ribbon(): boolean {
  //   return this.options.thing3Ribbon.value;
  // }

  // set thing3Ribbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.thing3Ribbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.thing3Ribbon.value = !value;
  //     (document.getElementById('thing3Ribbon') as HTMLInputElement).checked = true;
  //   }
  // }


  // get cubeRibbon(): boolean {
  //   return this.options.cubeRibbon.value;
  // }

  // set cubeRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.cubeRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.cubeRibbon.value = !value;
  //     (document.getElementById('cubeRibbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get sphereRibbon(): boolean {
  //   return this.options.sphereRibbon.value;
  // }

  // set sphereRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.sphereRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.sphereRibbon.value = !value;
  //     (document.getElementById('sphereRibbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get poleRibbon(): boolean {
  //   return this.options.poleRibbon.value;
  // }

  // set poleRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.poleRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.poleRibbon.value = !value;
  //     (document.getElementById('poleRibbon') as HTMLInputElement).checked = true;
  //   }
  // }

  // get heartRibbon(): boolean {
  //   return this.options.heartRibbon.value;
  // }

  // set heartRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.heartRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.heartRibbon.value = !value;
  //     (document.getElementById('heartRibbon') as HTMLInputElement).checked = true;
  //   }
  // }


  // get sineLoopRibbon(): boolean {
  //   return this.options.sineLoopRibbon.value;
  // }

  // set sineLoopRibbon(value: boolean) {
  //   if ((!value && this.getSelectedRibbonSPSCount() > 1) || value) {
  //     this.options.sineLoopRibbon.value = value;
  //     this.announceChange('sps change');
  //     this.storageService.saveOptions(this.options);
  //   } else {
  //     this.options.sineLoopRibbon.value = !value;
  //     (document.getElementById('sineLoopRibbon') as HTMLInputElement).checked = true;
  //   }
  // }






  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////



  get showPanel(): boolean {
    return this.state.showPanel.value;
  }

  get showFavorites(): boolean {
    return this.state.showFavorites.value;
  }

  // set showPanel(value: boolean) {
  //   this.state.showPanel.value = value;
  // }

  get showPlayer(): boolean {
    return this.state.showPlayer.value;
  }

  // set showPlayer(value: boolean) {
  //   this.state.showPlayer.value = value;
  // }

  get showSplash(): boolean {
    return this.state.showSplash.value;
  }

  // set showSplash(value: boolean) {
  //   this.state.showSplash.value = value;
  // }

  get currentVisual(): number {
    return this.state.currentVisual.value;
  }

  set currentVisual(value: number) {
    this.state.currentVisual.value = value;
    this.storageService.saveOptions(this.options);

  }

  // get blockPlaneManager(): boolean {
  //   return this.options.blockPlaneManager.checked;
  // }

  // set blockPlaneManager(value: boolean) {
  //   this.options.blockPlaneManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get blockSpiralManager(): boolean {
  //   return this.options.blockSpiralManager.checked;
  // }

  // set blockSpiralManager(value: boolean) {
  //   this.options.blockSpiralManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get spectrograph(): boolean {
  //   return this.options.spectrograph.checked;
  // }

  // set spectrograph(value: boolean) {
  //   this.options.spectrograph.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get equationManager(): boolean {
  //   return this.options.equationManager.checked;
  // }

  // set equationManager(value: boolean) {
  //   this.options.equationManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get cubeManager(): boolean {
  //   return this.options.cubeManager.checked;
  // }

  // set cubeManager(value: boolean) {
  //   this.options.cubeManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get starManager(): boolean {
  //   return this.options.starManager.checked;
  // }

  // set starManager(value: boolean) {
  //   this.options.starManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  get customColors(): boolean {
    return this.options.customColors.value;
  }

  set customColors(value: boolean) {
    this.options.customColors.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].customColors = value;
    this.storageService.saveOptions(this.options);
  }

  get autoRotate(): boolean {
    return this.options.autoRotate.value;
  }

  set autoRotate(value: boolean) {
    this.options.autoRotate.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].autoRotate = value;
    this.storageService.saveOptions(this.options);
  }

  get minColor(): string {
    return this.options.minColor.value;
  }

  set minColor(value: string) {
    this.options.minColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].minColor = value;

    this.storageService.saveOptions(this.options);
  }


  get midColor(): string {
    return this.options.midColor.value;
  }

  set midColor(value: string) {
    this.options.midColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].midColor = value;
    this.storageService.saveOptions(this.options);
  }


  get maxColor(): string {
    return this.options.maxColor.value;
  }

  set maxColor(value: string) {
    this.options.maxColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].maxColor = value;
    this.storageService.saveOptions(this.options);
  }


  get midLoc(): number {
    return this.options.midLoc.value;
  }

  set midLoc(value: number) {
    this.options.midLoc.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].midLoc = value;
    this.storageService.saveOptions(this.options);
  }


  get currentTrack(): number {
    return this.state.currentTrack.value;
  }

  // set currentTrack(value: number) {
  //   this.state.currentTrack.value = value;
  //   this.storageService.saveOptions(this.options);
  // }

  get input(): string {
    return this.state.input.value;
  }

  set input(value: string) {
    this.state.input.value = value;
    this.storageService.saveOptions(this.options);
  }

  get playing(): boolean {
    return this.state.playing.value;
  }

  set playing(value: boolean) {
    this.state.playing.value = value;
    this.storageService.saveOptions(this.options);
  }

  get microphone(): boolean {
    return this.state.microphone.value;
  }

  set microphone(value: boolean) {
    this.state.microphone.value = value;
    this.storageService.saveOptions(this.options);
  }

}
