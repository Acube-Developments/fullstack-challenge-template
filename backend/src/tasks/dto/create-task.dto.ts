import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  priority?: number;
}
