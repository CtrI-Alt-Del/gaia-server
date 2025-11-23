import { Module } from '@nestjs/common'

import { DEPENDENCIES } from '@/infra/constants/dependencies'
import { PdfmakePdfProvider } from './pdfmake-pdf-provider'

@Module({
  providers: [
    {
      provide: DEPENDENCIES.provision.pdfProvider,
      useClass: PdfmakePdfProvider,
    },
  ],
  exports: [DEPENDENCIES.provision.pdfProvider],
})
export class PdfProviderModule {}
