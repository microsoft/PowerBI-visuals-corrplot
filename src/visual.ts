/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual {

    interface VisualSettingsCorrplotParams {
        show: boolean;
        mytype: string;
        method: string;
        addrect: string;
        order: string;
    }

    interface VisualSettingsLabelsParams {
        show: boolean;
        textSize: number;
        tl_col: string;
    }
    interface VisualSettingsCoeffParams {
        show: boolean;
        addCoef_col: string;
        number_digits: string;
        textSize: number;

    }
    interface VisualSettingsAdditionalParams {
        show: boolean;
        showWarnings: boolean;
    }

    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;

        private settings_corrplot_params: VisualSettingsCorrplotParams;
        private settings_labels_params: VisualSettingsLabelsParams;
        private settings_coeff_params: VisualSettingsCoeffParams;
        private settings_additional_params: VisualSettingsAdditionalParams;


        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement('div');
            this.imageDiv.className = 'rcv_autoScaleImageContainer';
            options.element.appendChild(this.imageDiv);

            this.imageElement = document.createElement('img');
            this.imageElement.className = 'rcv_autoScaleImage';

            this.imageDiv.appendChild(this.imageElement);

            this.settings_corrplot_params = <VisualSettingsCorrplotParams>{
                show: false,
                method: "circle",
                mytype: "full",
                order: "original",
                addrect: "none",
            };

            this.settings_labels_params = <VisualSettingsLabelsParams>{
                show: false,
                textSize: 10,
                tl_col: "red",
            };
            this.settings_coeff_params = <VisualSettingsCoeffParams>{
                show: false,
                addCoef_col: "black",
                number_digits: "1",
                textSize: 8
            };
            this.settings_additional_params = <VisualSettingsAdditionalParams>{
                show: false,
                showWarnings: false,
            };
        }

        public update(options: VisualUpdateOptions) {
            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            this.settings_corrplot_params = <VisualSettingsCorrplotParams>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings_corrplot_params', 'show', false),
                method: getValue<string>(dataView.metadata.objects, 'settings_corrplot_params', 'method', "circle"),
                mytype: getValue<string>(dataView.metadata.objects, 'settings_corrplot_params', 'mytype', "full"),
                addrect: getValue<string>(dataView.metadata.objects, 'settings_corrplot_params', 'addrect', "0"),
                order: getValue<string>(dataView.metadata.objects, 'settings_corrplot_params', 'order', "original"),


            };


            this.settings_labels_params = <VisualSettingsLabelsParams>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings_labels_params', 'show', false),
                textSize: getValueMinMax<number>(dataView.metadata.objects, 'settings_labels_params', 'textSize', 10, 5, 50),
                tl_col: getValue<string>(dataView.metadata.objects, 'settings_labels_params', 'tl_col', "red"),
            };
            this.settings_coeff_params = <VisualSettingsCoeffParams>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings_coeff_params', 'show', false),
                addCoef_col: getValue<string>(dataView.metadata.objects, 'settings_coeff_params', 'addCoef_col', "black"),
                number_digits: getValue<string>(dataView.metadata.objects, 'settings_coeff_params', 'number_digits', "1"),
                textSize: getValue<number>(dataView.metadata.objects, 'settings_coeff_params', 'textSize', 8)

            };
            this.settings_additional_params = <VisualSettingsAdditionalParams>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'show', false),
                showWarnings: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'showWarnings', false)
            };

            let imageUrl: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
            }

            if (imageUrl) {
                this.imageElement.src = imageUrl;
            } else {
                this.imageElement.src = null;
            }

            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {
            this.imageDiv.style.height = finalViewport.height + 'px';
            this.imageDiv.style.width = finalViewport.width + 'px';
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'settings_corrplot_params':
                    if (this.settings_corrplot_params.addrect == "0") {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                show: this.settings_corrplot_params.show,
                                method: this.settings_corrplot_params.method,
                                addrect: this.settings_corrplot_params.addrect,
                                mytype: this.settings_corrplot_params.mytype,
                                order: this.settings_corrplot_params.order
                            },
                            selector: null
                        });
                    }
                    else {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                show: this.settings_corrplot_params.show,
                                method: this.settings_corrplot_params.method,
                                addrect: this.settings_corrplot_params.addrect,
                            },
                            selector: null
                        });

                    }
                    break;

                case 'settings_labels_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings_labels_params.show,
                            textSize: this.settings_labels_params.textSize,
                            tl_col: this.settings_labels_params.tl_col
                        },
                        selector: null
                    });
                    break;
                case 'settings_coeff_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings_coeff_params.show,
                            number_digits: this.settings_coeff_params.number_digits,
                            addCoef_col: this.settings_coeff_params.addCoef_col,
                            textSize: this.settings_coeff_params.textSize,
                        },
                        selector: null
                    });
                    break;
                case 'settings_additional_params':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings_additional_params.show,
                            showWarnings: this.settings_additional_params.showWarnings,
                        },
                        selector: null
                    });
                    break;
            };

            return objectEnumeration;
        }
    }
}