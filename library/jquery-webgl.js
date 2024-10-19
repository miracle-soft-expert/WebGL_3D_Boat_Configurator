/**
 *
 * Jquery WebGL Rendering Plugin
 *
  * Created  : 2016/06/20
 * 
 * Jquery WebGL library
 *
 */

(function( $ ){
	
	$.fn.showModel = function(para) 
	{
		var main 		= this;

		main.elemID 	= "";
		main.objList 	= para;
		main.render_id 	= 0;
		main.m_color 	= 0xFF0000;
		main.clock 		= new THREE.Clock();
        main.obj_boart  = null;

		main.view_angle = 45;
		main.near 		= 0.1;
		main.far 		= 2000;

		main.camera_x 	= 0;
		main.camera_y 	= 100;
		main.camera_z 	= 400;

		main.camera_lx 	= 0;
		main.camera_ly 	= 0;
		main.camera_lz 	= 0;

		main.dlight 	= 0xFFFFFF;
		main.hlight 	= 0xFFFFFF;
		main.hopacity 	= 0.3;

		main.hemi_h 	= 0.58;
		main.hemi_s 	= 0.16;
		main.hemi_l 	= 0.88;

		main.hemi_x 	= 0;
		main.hemi_y 	= 200;
		main.hemi_z 	= 0;

		main.light_x 	= -100;
		main.light_y 	= 100;
		main.light_z 	= 150;

		main.gcolor_h 	= 0.095;
		main.gcolor_s 	= 0.5;
		main.gcolor_l 	= 0.5;

		main.shininess 	= 2;
		main.ambient 	= 0x969696;
		main.amb_color 	= 0xFFFFFF;
		main.specular 	= 0xE5E5E5;
		main.opacity 	= 100;
        main.mirror     = null;

		main.obj_scaleX = 1;
		main.obj_scaleY = 1;
		main.obj_scaleZ = 1;

		main.init 			= function()
		{
            main.elemID = $(this).attr("id");

			main.initScene();
            main.initCamera();
            main.initRenderer();
            main.initLights();
            main.initElement();
            main.initControl();
            main.initGround();
			// main.dispObjects();
			main.render();
            main.initColorBar();
            main.canvControl();
		}

		main.initElement 	= function()
		{
			document.getElementById(main.elemID).appendChild(main.webGLRenderer.domElement);
		}

		main.initScene      = function()
        {
            main.scene      = new THREE.Scene();
        }

        main.initColorBar   = function()
        {
            $("#color_box li").each(function()
            {
                $(this).css("background-color", $(this).attr("color"));
            });

            $("#color_box li").click(function()
            {
                var color       = $(this).attr("color");

                $("#color_box .sel").removeClass("sel");
                $("#txt_color").val(color);
                $(this).addClass("sel");

                if(!main.obj_boart)
                    return;

                main.obj_boart.children[2].material.color = new THREE.Color(color);
            });
        }

        main.canvControl    = function()
        {
            $("#control_area li").click(function()
            {
                var index = $(this).index();

                switch(index)
                {
                    case 0 : 
                        main.obj_boart.rotation.z = main.obj_boart.rotation.z + 0.25;
                    break;

                    case 1 : 
                        main.orbitControls.zoomIn(1.1);
                    break;

                    case 2 : 
                        main.orbitControls.zoomOut(1.1);
                    break;
                }
            });
        }

        main.initCamera     = function()
        {
            main.screen_width   = $("#" + main.elemID).width(), main.screen_height  = window.innerHeight;

            var ASPECT 			= main.screen_width / main.screen_height;
            
            main.camera = new THREE.PerspectiveCamera(main.view_angle, ASPECT, main.near, main.far);
            main.scene.add(main.camera);

            if($(window).width() < 700)
            {
                main.camera_z = 1000;
            }
            
            main.camera.position.set(main.camera_x, main.camera_y, main.camera_z);
            main.camera.lookAt(new THREE.Vector3(main.camera_lx, main.camera_ly, main.camera_lz));
        }

        main.initControl    = function()
        {
            console.log(main.webGLRenderer.domElement);
            main.orbitControls          	= new THREE.OrbitControls(main.camera, main.webGLRenderer.domElement);
            main.orbitControls.maxDistance 	= main.far;
        }

        main.initRenderer   = function()
        {
            main.webGLRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
            main.webGLRenderer.setSize(main.screen_width, main.screen_height);

            main.webGLRenderer.shadowMapEnabled = true;
            main.webGLRenderer.shadowMapSoft    = true;
        }

        main.initGround     = function()
        {
            return;
            // var mirrorMesh = null;
            // var planeGeo   = new THREE.PlaneGeometry( 550, 550 );

            // main.mirror     = new THREE.Mirror( main.webGLRenderer, main.camera, { clipBias: 0.01, textureWidth: 1000, textureHeight: 1000, color: 0xDDDDDD } );
            
            // mirrorMesh      = new THREE.Mesh( planeGeo, main.mirror.material );
            // mirrorMesh.add( main.mirror );
            // mirrorMesh.rotateX( - Math.PI / 2 );
            // mirrorMesh.position.y = - 2;
            // mirrorMesh.receiveShadow = true;

            // main.scene.add( mirrorMesh );

            var groundGeo = new THREE.PlaneGeometry( 500, 500 );
            var groundMat = new THREE.MeshBasicMaterial( { color:0xf0f0f0, overdraw: true, side:THREE.DoubleSide } );

            var ground = new THREE.Mesh( groundGeo, groundMat );
            ground.rotation.x = -Math.PI/2;
            ground.position.y = -20;
            ground.castShadow       = true;
            ground.receiveShadow    = true;

            main.scene.add( ground );

        }

        main.initLights     = function()
        {
            var light       = new THREE.DirectionalLight( main.dlight );
            var light2      = new THREE.DirectionalLight( main.dlight );
            var hemiLight   = new THREE.HemisphereLight( main.hlight, main.hlight, main.hopacity );

            hemiLight.color.setHSL( main.hemi_h, main.hemi_s, main.hemi_l );
            hemiLight.groundColor.setHSL( main.gcolor_h, main.gcolor_s, main.gcolor_l );
            hemiLight.position.set( main.hemi_x, main.hemi_y, main.hemi_z );

            light.position.set( main.light_x, main.light_y, main.light_z );
            light.target.position.copy(main.scene.position );

            light2.position.set( main.light_x * (-1), main.light_y, main.light_z * (-1));
            light2.target.position.copy(main.scene.position );
            light.castShadow = true;

            main.scene.add( hemiLight );
            main.scene.add( light );
            main.scene.add( light2 );
        }

        main.dispObjects 	= function()
        {
        	if(!main.objList || !main.objList.length)
        		return;

        	if(!main.objList[main.render_id])
        		return;

        	main.addObject(main.objList[main.render_id]);
        }

        main.addObject 		= function(param)
        {
        	var pos_x 		= 0;
        	var pos_y 		= 0;
        	var pos_z 		= 0;

        	var material 	= null;
            var objLoader   = new THREE.OBJLoader();
        	var mtlLoader 	= new THREE.MTLLoader();
        	var obj_path 	= param.obj;

        	var mtl_path 	= param.mtl;
        	var mtl_color 	= param.color ? param.color : main.m_color;

    		var pos_x 	= param.pos_x ? param.pos_x : 0;
            var pos_y 	= param.pos_y ? param.pos_y : 0;
            var pos_z 	= param.pos_z ? param.pos_z : 0;

            var scale_x = param.scale_x;
            var scale_y = param.scale_y;
            var scale_z = param.scale_z;

            var onProgress = function ( xhr ) 
            {
                if ( xhr.lengthComputable ) 
                {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                }
            };

            var onError = function ( xhr ) { };

            mtlLoader.load( mtl_path, function( materials ) 
            {
                materials.preload();

                objLoader.setMaterials( materials );
                objLoader.load(obj_path , function ( loadedMesh ) 
                {
                    loadedMesh.position.x = pos_x;
                    loadedMesh.position.y = pos_y;
                    loadedMesh.position.z = pos_z;

                    loadedMesh.scale.set(main.obj_scaleX, main.obj_scaleY, main.obj_scaleZ);
                    loadedMesh.rotation.x = Math.PI / (-2);
                    loadedMesh.rotation.z = Math.PI / (2);

                    main.obj_boart = loadedMesh;

                    main.scene.add(loadedMesh);
                });
            }, onProgress, onError );
        }

        main.render     = function() 
        {
            var delta = main.clock.getDelta();

            main.orbitControls.update(delta);

            requestAnimationFrame(main.render);

            if(main.mirror)
            {
                main.mirror.render( );
            }

            main.webGLRenderer.render(main.scene, main.camera);
        }

        main.init();

        return main;
	}; 

})( jQuery );